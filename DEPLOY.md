# Deployment Instructions

## Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Option 1: Using Vercel CLI (Recommended)

1.  **Install Vercel CLI** (if you haven't already):
    ```bash
    npm i -g vercel
    ```

2.  **Deploy**:
    Run the following command in your terminal and follow the prompts:
    ```bash
    npx vercel
    ```

3.  **Production Deployment**:
    To deploy to production:
    ```bash
    npx vercel --prod
    ```

### Option 2: Using Git Integration

1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Import your project into Vercel.
3.  Vercel will automatically detect that it's a Next.js app and configure the build settings.
