---
title: Working With AI Tools
createdAt: 2025-08-22
updatedAt: 2026-09-24
---

_2026-09-24_

I'm gonna start adding stuff to the top of these so it's easier to find. I have an update on my thoughtz on AI and I feel like sharing. I want to be clear that I have found use in AI tools. SOME LEGITIMATE USE. Most of it is fucking garbage. Most of the worst of it comes from the usual suspect, the intersection of technology, innovation, and ~~capitalism~~ greed. Some points:

- The tech is interesting
- It IS essentially a REALLY good search engine
- It is not INTELLIGENT
- "Rogue agents" is fucking hilarious and, to be extremely generous, a misnomer
- AI IS software like all other software which is to say IT DOES WHAT IT IS TOLD TO DO

The narrative being sold by big AI companies is that it is becoming unwieldy. I agree with the word "unwieldy", but not in regard to the tech. The systems that create and manage these tools are unwieldy and they are all only concerned with shareholder value. I would say they are only worried about money but they don't make any money.

I saw [a recent video from PrimeTime that I guess inspired me to share these thoughts](https://www.youtube.com/watch?v=iuccfEQgIeY). The TOOLS in and of themselves are pretty cool. The infrastructure, as is always the case, is terrible. I'm trying to figure out where AI fits into my local development. It still operates mostly as a search engine for me in my free time. I have experimented with a couple of agentic tools. I do not plan to give Claude agentic access to my system in it's current form. There are some cool open source tools (OpenCode, Hermes, probably some others that I don't know about yet). OpenCode bricked my homelab. I'm still cleaning up from that. The experience taught me to start doing backups...

Anyway, I guess this opinion is more AI adjacent than _about_ AI. I like the tech, I hate the companies, and it should be illegal to have $1B.

---

I've recently been working a lot more with Claude Sonnet 4. I have a lot of conflicting feelings about AI. But I have been working with this tool in an effort to understand exactly what it does well and see if there is anything beneficial that I can incorporate into my workflow. It turns out, I have definitely found useful applications. I'm going to list anything I find useful here.

---

I have been using Claude Sonnet 4 as sort of a glorified search engine. Most recently, I have been trying to use Obsidian more effectively. I have been trying to use Obsidian as a complementary tool to my analog notebooks. I ran up against an issue where Obsidian was becoming more of a hindrance than a helper. I was using the daily notes feature of Obsidian. The problem is that I started to feel obligated to fill out my daily note, which had grown quite lengthy with "helpful" sections. It got to the point that I was taking time away from more productive efforts to keep my daily note streak going. Once I realized that this is what I was actually doing, I abandoned the digital note platform all together. I was actually able to have a conversation with Claude and develop a new strategy for using Obsidian along side my analog notes system as well as an all new Obsidian daily note template. I count this as a beneficial use case.

**Artifacts**

[My Obsidian + Analog Journal Methodology](/cultivated-thoughtz/my-obsidian-methodology/)

New Obsidian Daily Note Template

```markdown
# <% tp.date.now("YYYY-MM-DD") %> - <% tp.date.now("dddd") %>

## 📊 Habits

| Habit             | ✓   | Notes |
| ----------------- | --- | ----- |
| Exercise          |     |       |
| Reading           |     |       |
| Water (8 glasses) |     |       |
| Sleep (7+ hours)  |     |       |
| Zettelkasten work |     |       |

## 🔗 Digital Thoughts

_Quick captures when I'm already here_

## 📝 From My Journal

## _Key insights worth linking/connecting later_

## 🎯 Today's Intention

_One simple focus_

## 📋 Logs

- _Notes started today_

---

**Quick Links:** [[Yesterday|←]] | [[Tomorrow|→]] | [[Weekly Review]]

<% tp.date.now("yyyyMMDDHHmmss") %>
```

---

AI is also really helpful with mundane tasks like writing K8S Kustomize files and corresponding manifests. You do need to know what they should look like so that you can verify that they are correct. It is unadvisable to trust any AI tool to just write you something and then just use it in your infrastructure. But it generally does a good job. I have noticed that it **can** hallucinate with larger jobs though. But I built out a whole projects Kustomize infra with Claude:

[Project Acorn](https://github.com/donhamiltoniii/project-acorn)

**base/deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-acorn
  namespace: project-acorn
  annotations:
    argocd-image-updater.argoproj.io/image-list: website=ghcr.io/donhamiltoniii/project-acorn
    argocd-image-updater.argoproj.io/write-back-method: git
    argocd-image-updater.argoproj.io/git-branch: main
spec:
  replicas: 2
  selector:
    matchLabels:
      app: project-acorn
  template:
    metadata:
      labels:
        app: project-acorn
    spec:
      imagePullSecrets:
        - name: ghcr-secret
      containers:
        - name: website
          image: project-acorn-image # This will be replaced by Kustomize
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: '64Mi'
              cpu: '100m'
            limits:
              memory: '128Mi'
              cpu: '200m'
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
```

**base/ingress.yaml**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: project-acorn-ingress
  namespace: project-acorn
  annotations:
    kubernetes.io/ingress.class: 'traefik'
spec:
  rules:
    - host: project-acorn.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: project-acorn-service
                port:
                  number: 80
```

**base/namespace.yaml**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: project-acorn
```

**base/service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: project-acorn-service
  namespace: project-acorn
spec:
  selector:
    app: project-acorn
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

**base/kustomization.yaml**

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - namespace.yaml
  - deployment.yaml
  - service.yaml
  - ingress.yaml

commonLabels:
  app: project-acorn
  version: v1.0.0

images:
  - name: project-acorn-image
    newName: ghcr.io/donhamiltoniii/project-acorn
    newTag: latest
```

**overlays/dev/deployment-patch.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-acorn
  namespace: project-acorn
spec:
  template:
    spec:
      containers:
        - name: website
          resources:
            requests:
              memory: '32Mi'
              cpu: '50m'
            limits:
              memory: '64Mi'
              cpu: '100m'
          env:
            - name: ENVIRONMENT
              value: 'development'
```

**overlays/dev/ingress-patch.yaml**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: project-acorn-ingress
  namespace: project-acorn
spec:
  rules:
    - host: dev.project-acorn.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: project-acorn-service # Kustomize will transform this
                port:
                  number: 80
```

**overlays/dev/kustomization.yaml**

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: project-acorn-dev

resources:
  - ../../base

namePrefix: dev-
nameSuffix: -dev

commonLabels:
  environment: dev

patchesStrategicMerge:
  - deployment-patch.yaml
  - ingress-patch.yaml

images:
  - name: project-acorn-image
    newTag: dev-latest

replicas:
  - name: project-acorn
    count: 1
```

**overlays/prod/deployment-patch.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-acorn
  namespace: project-acorn
spec:
  template:
    spec:
      containers:
        - name: website
          resources:
            requests:
              memory: '128Mi'
              cpu: '200m'
            limits:
              memory: '256Mi'
              cpu: '500m'
          env:
            - name: ENVIRONMENT
              value: 'production'
```

**overlays/prod/ingress-patch.yaml**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: project-acorn-ingress
  namespace: project-acorn
spec:
  rules:
    - host: project-acorn.k3s.syntaxandsymbols.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: project-acorn-service # Kustomize will transform this
                port:
                  number: 80
```

**overlays/prod/kustomization.yaml**

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: project-acorn-prod

resources:
  - ../../base

namePrefix: prod-
nameSuffix: -prod

commonLabels:
  environment: prod

patchesStrategicMerge:
  - deployment-patch.yaml
  - ingress-patch.yaml

images:
  - name: project-acorn-image
    newTag: latest

replicas:
  - name: project-acorn
    count: 3
```
