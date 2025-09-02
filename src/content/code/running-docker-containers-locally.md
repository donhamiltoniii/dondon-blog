---
title: Running Docker Containers Locally
description: A working document with instructions and tips for how to setup a local Ubuntu server with Docker installed and run your own applications
pubDate: 2025-01-01
lastUpdate: 2025-01-01
heroImage: "https://picsum.photos/720/360"
published: true
---

In an effort to learn more about Linux for the purposes of running a homelab and self hosting applications built by me as well as others, I am going through [this wonderful course on Udemy](https://www.udemy.com/course/linux-administration-build-hands-on-linux-projects/). In an effort to better remember everything I learned, I'm documenting some of the processes that I learned to implement a custom [Astro](https://astro.build/) application.

## Initial Setup

The first thing you need to do is provision a server. There are a whole bunch of ways to achieve this goal and I will leave that to you to decide. My existing home lab environment is running [Proxmox](https://www.proxmox.com/en/) which I highly recommend. Especially if you are new to virtualization. Proxmox is a hypervisor that makes provisioning new servers simple and easy. The biggest benefit of a hypervisor like Proxmox is that you can create and delete servers at will without having to re-provision the same machine over and over and over. This is super convenient if you're learning and will be creating lots of short lived servers frequently for the purposes of learning something new.

## Setup Ubuntu

After installing Ubuntu (by [following the docs](https://ubuntu.com/server/docs/basic-installation)), you should [setup a static IP address](https://www.linuxtechi.com/static-ip-address-on-ubuntu-server/). This is an important step because it gives you a reliable IP by which you can reach your server. It's also a good idea to go to your router settings a restrict the range of IP addresses that your router can use to assign to new devices. Your static IP should exist outside of the range you set in your router to avoid duplicate assignments. Now it's time to install some stuff!

### Setup SSH

First, make sure that OpenSSH is installed. Run the following to check the status:

```bash
service ssh status
```

If you see something that looks like the following, you're all set:

```bash
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/usr/lib/systemd/system/ssh.service; disabled; preset: enabled)
     Active: active (running) since Sun 2024-12-29 20:47:38 UTC; 3 days ago
TriggeredBy: ● ssh.socket
       Docs: man:sshd(8)
             man:sshd_config(5)
   Main PID: 1442 (sshd)
      Tasks: 1 (limit: 2276)
     Memory: 2.8M (peak: 4.5M swap: 608.0K swap peak: 608.0K)
        CPU: 267ms
     CGroup: /system.slice/ssh.service
             └─1442 "sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups"
```

If you see a message indicating that there is no SSH service, then run the following commands to get it installed and running:

```bash
sudo apt update && sudo apt install ssh
service ssh start
service ssh status
```

After running those commands you should see that the service is indeed active.

### Install Docker

Next we need to have Docker running in order to have an environment to run containers. As a prerequisite, we need to make sure there are a couple of other packages we need to make sure are installed. Run the following commands:

```bash
sudo apt update
sudo apt install apt-transport-https curl
```

This ensures that we can download the next piece that will actually allow us to download and install Docker.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

Now run the following command to add the docker repository to our system:

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Finally, we can run the last command that will install docker on our Ubuntu server:

```bash
sudo apt update && sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Once everything is installed we can check first to make sure that the service is running

```bash
service docker status
```

You should see something that looks similar to the following:

```bash
● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: active (running) since Sun 2024-12-29 21:21:54 UTC; 3 days ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 3035 (dockerd)
      Tasks: 17
     Memory: 673.7M (peak: 722.1M swap: 3.9M swap peak: 3.9M)
        CPU: 59.400s
     CGroup: /system.slice/docker.service
             └─3035 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

**BONUS:** To run docker without having to type `sudo` all of the time, run the following command:

```bash
sudo usermod -aG docker ${USER}
```

Once docker is running, run the following to make sure that everything is functioning correctly and then we're good to move on!

```bash
docker container run hello-world
```

### Install NVM and Node

The next step is to install support for NVM, Node, and Git to pass projects back and forth so that we can develop them on a work machine and then pull them on this server environment for deployment. So let's get started. First, we need to install [Node Version Manager](https://github.com/nvm-sh/nvm).

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then start NVM with the following:

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

You should be able to run `nvm -v` now and see `v0.39.7` printed back to you.

Next, it's time to install Node. This is super easy with NVM.

```bash
nvm install --lts
```

Once NVM finishes up, run `node -v` and you should see a version printed out. So long as you do, Node is installed properly.

## Create new Astro app and push to git

Now that our server is setup to handle Node applications, let's bootstrap an example application that you can work with and grow as you see fit.

```bash
npm create astro@latest -- --template satnaing/astro-paper
```

In this example, we are using the [astro-paper theme](https://github.com/satnaing/astro-paper), but feel free to pick whatever you would like. I like starting with a blog. Even if you don't publish what you write, having a place to record and document the things you build is a good thing to have.

Once you have your project setup, push it up to git so that you can pull it down on your work machine and develop.

## Create Docker file

One of the reasons we are using the astro-paper theme is that we get a static build from it. This is helpful for the actual deployment process because it makes it easier to stand up a proper web server like [NGINX](https://www.f5.com/go/product/welcome-to-nginx) to serve our app. This isn't a necessity, but it is recommended. First, let's create a Dockerfile so that we can build an image of our application to soon run it in our docker instance. At the root of your project, create a new file called `Dockerfile` and paste the following values:

```go
FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
```

Since we are using NGINX, we will need to include a configuration file for it. At the root of your project, add a directory called `nginx` and then create a new file `nginx/nginx.conf` and inside of that new file, paste the following:

```
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  server {
    listen 8080;
    server_name   _;

    root   /usr/share/nginx/html;
    index  index.html index.htm;
    include /etc/nginx/mime.types;

    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    error_page 404 /404.html;
    location = /404.html {
            root /usr/share/nginx/html;
            internal;
    }

    location / {
            try_files $uri $uri/index.html =404;
    }
  }
}
```

With these files added, we have all pieces in place to build our application for production deployment. At this point it would be a good idea to make sure that we can see a functional version of our application. The following steps will make that happen.

### Build Docker Image

In order to run our application, we'll need a Docker image. One simple command will provide that for us from the existing application code. Run the following to generate the Docker image.

```bash
docker build . -t application-name:latest
```

In the previous command, replace `application-name` with whatever you want to call your application. This is how you will reference it to run it in Docker. If you plan to push this image up to [DockerHub](https://hub.docker.com/) you should amend the previous command slightly.

```bash
docker build . -t dockerhub-username/application-name:latest
```

In this case, substitute `dockerhub-username` with your actual DockerHub username. If you just plan to run your application in this singular location, you can forgo that extended name. If you decide later that you want to push your image to DockerHub, you can always build a new image with a new tag.

If you want to copy-pasta the exact command, use the following:

```bash
docker build . -t astro-blog-example:latest
```

### Run Docker Image

With our new Docker image built, let's run it and make sure that it works.

```bash
docker container run -d -p port-on-server:port-exposed-from-image tag-name
```

Replace these values with values that actually make sense for your specific application:

- `port-on-server`: The port number that you this application will be accessible from on your actual server.
- `port-exposed-from-image`: The port exposed in the Dockerfile. In this example, `8080`.
- `tag-name`: Whatever you named your application in the previous step.

Again, if you want to copy-pasta directly, use the following command:

```bash
docker container run -d -p 80:8080 astro-blog-example:latest
```

That command will run an instance of our application on port 80 of our server. Run the following command to confirm that this new instance is running without error:

```bash
docker container ls -a
```

You should see an output similar to the following:

```bash
CONTAINER ID   IMAGE                       COMMAND                  CREATED         STATUS         PORTS                                   NAMES
20ad93fe6224   astro-blog-example:latest   "/docker-entrypoint.…"   6 seconds ago   Up 6 seconds   0.0.0.0:80->8080/tcp, :::80->8080/tcp   pedantic_clarke
```

So long as your output looks similar to that, your application should be running. You should be able to go to your favorite browser on your dev machine, type the ip address of your server, and see the landing page of your application running! Congrats!

## Dev vs Prod

Now that we know that our application is capable of getting all the way to our production environment, we can start making it our own! It's a real challenge to develop in this environment though. Now there are certainly ways that we could develop this application here on the server, but it's not the best idea. Mixing your production environment and development environment can get messy really quickly as you can make changes to one that may affect the other.

For this reason, the net step is to use git to commit all of the existing changes (at this point just the initialization of the app), connect to a remote repository on GitHub, and push. For that, I will assume that you are familiar with this process and have a GitHub account.

## Make updates to Astro app

With your application pushed to GitHub, you can now pull the repository down to any machine on which you would like to develop. Astro provides a rich developer experience out of the box but I encourage you to explore and see what you can make!

## Push to GitHub

Once you have your application in a state that you feel comfortable with and are ready to deploy, push this new version of your code up to GitHub from your dev environment.

## Deploy!

The final step is to deploy again! You can repeat this process ad infinitum. Any time you make a new version of your application, go to your server environment, pull the version you wish to deploy, rebuild your docker image (or build with a new version tag), stop your previous example, and run the new one!

At this point, you have a running application! Congratulations! You have deployed an application in your local network completely from scratch! This is a huge accomplishment. But this can also be just another starting point if you'd like. There are plenty of improvements that can be made to this process.

## Challenges

If you want to take this a step further, here are a couple of suggestions:

- Look into setting up a CI/CD pipeline with something like Jenkins or Github Actions. This will eliminate the need for you to manually pull new versions of your app and make new deploys in Docker.
- Use Docker Compose to make more complex deploys. For example you could run another container alongside this application with a database so that you can manage persistent data in your application.
- Add authentication so that your application can support multiple users.
- Use a service like DuckDNS or some other DNS provider to get a static IP, or some other similar solution, and expose your application to the public internet.

## Conclusion

Hopefully this walkthrough has been beneficial and you have a running application somewhere other than your development machine. This is a huge step toward understanding full-stack development. The process and environment that you've just put in place exists as the foundation for many web applications. Granted, most processes are more complex than this. But the general principles remain the same. Continue to make changes and test the limits of Docker to see all of possibilities that exist!
