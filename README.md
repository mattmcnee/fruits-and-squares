# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## LinkedIn authentication for Firebase

Users can sign into their LinkedIn using OpenID Connect. Documentation for how this works is available [here](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2).

Once authenticated via LinkedIn, an account is created from the user's details and a custom token is returned to the client. Documentation [here](https://firebase.google.com/docs/auth/admin/create-custom-tokens).