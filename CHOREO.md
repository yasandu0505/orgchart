# Deployment Instructions for CHOREO

## Getting Started

### 1. Go to the Choreo console
```bash
https://console.choreo.dev/ 
```
Sign in using your Google, GitHub, or Microsoft account.

### 2. Create an Organization 

### 3. Create a Project

### 4. Click a Component (web application component)

### 5. Connect to the Git Repository (Continue with Github)

### 6. Select the repository name > branch

### 7. Create and deploy

### 8. Go to the left side panel and click on Build

Now you can see the your component is building.

### (After build) >>>>>>>>>>>>>>>>>

### 9. Go to the left side panel and click on Deploy

### 10. Click on the drop down arrow of Deploy button

Now you can see **Configure & Deploy**

### 11. You will get a window open from the right side.

-The window is for the mounting of **config.js** to the public folder.
-You can add the following Code there and edit it as your purpose.
```bash
window.configs = {     
    apiUrl : "{your service url from the choreo backend connection}",
    version : "{Your version}"
}
```
-You can add configuration that you need to mount in the deployment, but you should have implemented a logic to get those configs to the components.
-**Important - For the use of the configurations you should have imported the config file to the index.html file like below**
```bash
<script src="./public/config.js"></script>
```
if this is not there the configurations won't work. so if you see any error **First check this on**, you can test it on the local as well by adding a simple record to the config to see whether your logic is working or not.

1. First create a file on **public** folder as **config.js**.
2. Then add this sample config to the **config.js**.
```bash
window.configs = {     
    version : "rc-0.1.0"
}
```
3. Then in your react component, access the configuration like this.
```bash
useEffect(() => {
    const version = window?.configs?.version ? window.configs.version : "v1";
    console.log(version);
},[])
```
4. Check the console.

### 12. Deploy it

You can see it deploying. it will take some time may be even minutes. (depends on your internet speed)

### 13. After in the Development box you can see the Web App Url.


### Thank You

