# oma-ambulance-certs-user-list



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute  | Description | Type              | Default |
| ---------------- | ---------- | ----------- | ----------------- | ------- |
| `apiBase`        | `api-base` |             | `string`          | `""`    |
| `certifications` | --         |             | `Certification[]` | `[]`    |
| `userId`         | `user-id`  |             | `string`          | `""`    |
| `users`          | --         |             | `User[]`          | `[]`    |


## Events

| Event           | Description | Type                |
| --------------- | ----------- | ------------------- |
| `entry-clicked` |             | `CustomEvent<User>` |


## Dependencies

### Used by

 - [oma-ambulance-certs-app](../oma-ambulance-certs-app)

### Graph
```mermaid
graph TD;
  oma-ambulance-certs-app --> oma-ambulance-certs-user-list
  style oma-ambulance-certs-user-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
