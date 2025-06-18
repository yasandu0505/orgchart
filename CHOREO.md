
# 🚀 CHOREO Deployment Guide

Welcome to the complete deployment guide for CHOREO! Follow these steps to successfully deploy your web application.

---

## 🎯 Getting Started

### 1. 🌐 Access the Choreo Console  
🔗 Visit: [https://console.choreo.dev/](https://console.choreo.dev/)  
🔑 Sign in using your **Google**, **GitHub**, or **Microsoft** account.

---

### 2. 🏢 Create an Organization  
Set up your organization to manage your projects and components.

---

### 3. 📁 Create a Project  
Initialize a new project within your organization.

---

### 4. 🧩 Create a Component  
Click on **Web Application Component** to start building your app.

---

### 5. 🔗 Connect to Git Repository  
Select **Continue with GitHub** to link your code repository.

---

### 6. 📂 Select Repository & Branch  
Choose your **repository name** and the **desired branch** for deployment.

---

### 7. 🧾 Add Component Details  
- **Display Name**  
- **Name**  
- **Description** (optional)

---

### 8. ⚙️ Choose Build Presets  
Since this is a React app, choose the **React preset**.

---

### 9. 🏗️ Build Configuration  
- **Build Command**:  
  ```bash
  npm install && npm run build
  ```
- **Build Path**:  
  ```
  dist
  ```
- **Node Version**:  
  ```
  18
  ```

---

### 10. ✨ Create and Deploy  
Click **Create and Deploy** to start the build and deployment process.

---

### 11. 🔨 Monitor the Build Process  
Go to the **left sidebar** → Click on **Build**  
🎉 You can now see your component building in real-time!

---

## 🚀 Post-Build Deployment

### 12. 📦 Navigate to the Deploy Section  
Go to the **left sidebar** → Click on **Deploy**

---

### 13. ⚙️ Access Deployment Options  
Click the **dropdown arrow** on the Deploy button → Select **Configure & Deploy**

---

### 14. 🛠️ Configuration Setup  

In the side panel, you’ll mount your `config.js` file to the **public** folder.

#### 📝 Configuration Example:
```javascript
window.configs = {
  apiUrl: "{your service url from the Choreo backend connection}",
  version: "{Your version}"
};
```

> 💡 **Pro Tip**: You can add any config values you need. Just ensure your app is using them properly.

---

#### ⚠️ Critical Requirement: Add Script to `index.html`
You **MUST** add the script tag to your `index.html`:

```html
<script src="/config.js"></script>
```

🚨 **Important**: If this tag is missing, `window.configs` will not be available in your app.

---

## 🧪 Testing Configuration Locally

### ✅ Step-by-Step Local Testing

1. **📁 Create `config.js` in your `public/` folder**

2. **📝 Add Sample Configuration**
```javascript
window.configs = {
  version: "rc-0.1.0"
};
```

3. **⚛️ Access Config in React Component**
```javascript
useEffect(() => {
  const version = window?.configs?.version ?? "v1";
  console.log(version);
}, []);
```

4. **🔍 Check the Console**  
Ensure the configuration value logs correctly.

---

## 🚀 Final Deployment

### 15. 🚀 Deploy Your Application  
Click **Deploy** and wait for the process to complete.

⏳ Deployment may take a few minutes depending on app size and internet speed.

---

### 16. 🎉 Access Your Deployed App  
After deployment, your **Web App URL** will be available in the **Development** section.

---

## 🎊 Congratulations!

Your CHOREO web application is now successfully deployed and live! 🚀🎉

---

### 📞 Need Help?

If you run into any issues:

- ✅ Check `config.js` is created properly
- ✅ Ensure script tag is in `index.html`
- ✅ Confirm config access logic is implemented correctly

---

**Happy Deploying!** ✨🌐💻
