const assert = require('assert');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Provider = require('oidc-provider');
const Account = require('./account');
const ConfigProcessor = require('./config')
const fs = require('fs');
const yaml = require('js-yaml');
const url  = require('url');

assert(process.env.PROVIDER_URL, 'process.env.PROVIDER_URL missing');
assert(process.env.PORT, 'process.env.PORT missing');
assert(process.env.CLIENTS_CONFIG_FILE, 'process.env.CLIENTS_CONFIG_FILE missing');
assert(process.env.JWKS_FILE, 'process.env.JWKS_FILE missing');

const fileContents = fs.readFileSync(process.env.CLIENTS_CONFIG_FILE, 'utf8');
let rawConfig = yaml.safeLoad(fileContents);
const config = ConfigProcessor.evalConfigStrings(rawConfig)
const jwks = require(process.env.JWKS_FILE);

const contextPath = url.parse(process.env.PROVIDER_URL).pathname

const oidc = new Provider(process.env.PROVIDER_URL, {
  clients: config.clients,
  jwks,
  findAccount: Account.findAccount,
  claims: {
    openid: ['sub', 'email'],
    email: ['email']
  },
  interactions: {
    url(ctx) {
      return `${contextPath}/interaction/${ctx.oidc.uid}`;
    },
  },
  features: {
    devInteractions: { enabled: false },
    introspection: { enabled: true },
    revocation: { enabled: true },
    sessionManagement: { enabled: true },
  },
});

const { invalidate: orig } = oidc.Client.Schema.prototype;
oidc.Client.Schema.prototype.invalidate = function invalidate(message, code) {
  if (code === 'implicit-force-https' || code === 'implicit-forbid-localhost') {
    return;
  }
  orig.call(this, message);
};

const expressApp = express();
expressApp.set('trust proxy', true);
expressApp.set('view engine', 'ejs');
expressApp.set('views', path.resolve(__dirname, 'views'));

const parse = bodyParser.urlencoded({ extended: false });

function setNoCache(req, res, next) {
  res.set('Pragma', 'no-cache');
  res.set('Cache-Control', 'no-cache, no-store');
  next();
}

expressApp.get(`${contextPath}/interaction/:uid`, setNoCache, async (req, res, next) => {
  try {
    const details = await oidc.interactionDetails(req, res);
    //console.log('see what else is available to you for interaction views', details);
    const { uid, prompt, params } = details;

    const client = await oidc.Client.find(params.client_id);

    if (prompt.name === 'login') {
      return res.render('login', {
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Sign-in',
        flash: undefined,
        contextPath: contextPath,
      });
    }

    const result = {
      consent: {},
    };

    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
  } catch (err) {
    next(err);
  }
});

expressApp.post(`${contextPath}/interaction/:uid/login`, setNoCache, parse, async (req, res, next) => {
  try {
    const { uid, prompt, params } = await oidc.interactionDetails(req, res);
    const client = await oidc.Client.find(params.client_id);

    const accountId = await Account.authenticate(req.body.email, req.body.password);

    if (!accountId) {
      res.render('login', {
        client,
        uid,
        details: prompt.details,
        params: {
          ...params,
          login_hint: req.body.email,
        },
        title: 'Sign-in',
        flash: 'Invalid email or password.',
        contextPath: contextPath,
      });
      return;
    }

    const result = {
      login: {
        account: accountId,
      },
    };

    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});

oidc.proxy = true;
expressApp.use(contextPath, oidc.callback);

// express listen
expressApp.listen(process.env.PORT);
