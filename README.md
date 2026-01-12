<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Rotunda Architect

A Three.js visualization of a rotating megacity with concentric rings, featuring AI-powered architectural analysis and multi-passage rotary union infrastructure.

**Live App**: https://rotunda-architect-805436652134.us-west1.run.app/

View your app in AI Studio: https://ai.studio/apps/drive/17BBwNLy2Zy8GlnN9GALdr3y0EVu_S-Qn

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

## Deployment

This project uses Google Cloud Run with automated deployment via Cloud Build.

### Deployment Workflow

1. **Push to GitHub**: Commit and push changes to the `main` branch
2. **Cloud Build Trigger**: Automatically builds Docker image and deploys to Cloud Run
3. **Live Updates**: Changes are live at the URL above within 2-3 minutes

### Manual Deployment

Build and test locally:
```bash
docker build -t rotunda-architect .
docker run -p 8080:8080 rotunda-architect
```

Visit http://localhost:8080 to verify.

### Cloud Resources

- **Project ID**: gen-lang-client-0612863988
- **Region**: us-west1
- **Service**: rotunda-architect
- [Cloud Run Console](https://console.cloud.google.com/run/detail/us-west1/rotunda-architect/metrics?project=gen-lang-client-0612863988)
- [Cloud Build Console](https://console.cloud.google.com/cloud-build/builds?project=gen-lang-client-0612863988)

## Documentation

- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Technical References](docs/REFERENCES.md)
