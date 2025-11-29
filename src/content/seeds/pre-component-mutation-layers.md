---
title: Components, Data Layers, and the Adapter Pattern
createdAt: 2025-11-29
updatedAt: 2025-11-29
---

## Data Mutation

Recently I've been thinking about the importance of Component Design with regard to React/NextJS projects. But I think conceptually, this extends to any project that is component based. When you are developing components for an app, there is almost always some data layer that is providing you content. _Usually_ This comes in the form of some REST API request that returns you some JSON shape that you then plug into a component. What I have very recently conceptually considered, with respect to this relationship, is the Adapter Pattern. This should, in my opinion, ALWAYS come into play when building in this fashion. You should always be thinking of the props of your component as a public interface. The props should describe what the component can do, the component should not be altered to accommodate the props. There should be a layer between the data coming in and the component itself that should be doing the job of making the data fit the component. This is the Adapter Pattern.
