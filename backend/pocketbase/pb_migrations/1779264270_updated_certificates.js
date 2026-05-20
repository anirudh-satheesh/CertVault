/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3669933913")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = owner",
    "deleteRule": "@request.auth.id = owner",
    "listRule": "@request.auth.id = owner",
    "updateRule": "@request.auth.id = owner",
    "viewRule": "@request.auth.id = owner"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3669933913")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
