import { each, isString, isNumber } from "lodash";
import { get } from "mobx";
import { Types } from "./types";
import { createTransformer } from "mobx-utils";

const serializeModel = createTransformer(model => {
  let data = {};
  data.$type = model.$.schema.name;
  each(model.$.schema.props, (type, prop) => {
    const value = model[prop];
    if (!value) return;
    if (type.name === Types.MODEL) {
      data[prop] = get(model.$.ids, prop);
    } else if (type.name === Types.ARRAY) {
      if (type.of.name === Types.MODEL) {
        data[prop] = get(model.$.ids, prop).slice();
      } else {
        data[prop] = value.slice();
      }
    } else {
      data[prop] = value;
    }
  });
  if (model.$.isStore) {
    data.$models = {};
    model.$.models.forEach((model, id) => {
      data.$models[id] = serializeModel(model);
    });
  }
  return data;
});

export default serializeModel;

// const serializeFullModel = createTransformer(model => {
//   if (!model) return null;
//   let data = {};
//   if (model._collections) {
//     data._collections = {};
//     each(model._collections, (collection, name) => {
//       let child = {};
//       collection.byId.forEach((model, id) => {
//         child[id] = serializeFullModel(model);
//       });
//       data._collections[name] = child;
//     });
//   }
//   each(model._q.schema.props, (type, prop) => {
//     const value = model[prop];
//     if (!value) return;
//     if (type.name === Types.ARRAY) {
//       data[prop] = value.map(serializers[type.of.name]);
//     } else {
//       data[prop] = serializers[type.name](value);
//     }
//   });
//   return data;
// });

// const serializeMixed = createTransformer(data => {
//   if (!data) return null;
//   return { ...data };
// });

// const serializeNode = data => {
//   return data || null;
// };

// const serializeModel = createTransformer(data => {
//   if (!data) return null;
//   if (data._q.id) {
//     return data._q.id;
//   }
//   return serializeFullModel(data);
// });

// const serializers = {
//   [Types.ID]: serializeNode,
//   [Types.STRING]: serializeNode,
//   [Types.NUMBER]: serializeNode,
//   [Types.BOOLEAN]: serializeNode,
//   [Types.DATE]: serializeNode,
//   [Types.ENUM]: serializeNode,
//   [Types.MIXED]: serializeMixed,
//   [Types.MODEL]: serializeModel
// };

// export default serializeFullModel;
