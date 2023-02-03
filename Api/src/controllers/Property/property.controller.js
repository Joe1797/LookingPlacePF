import { Property } from "../../models/property.model.js";
import { Tenant } from "../../models/tenant.model.js";
import { Client } from "../../models/client.model.js";

export const createProperty = async (req, res) => {
  const {
    title,
    description,
    capacity,
    image,
    rating,
    tenant_property,
    client_property,
  } = req.body;
  try {
    let newProperty = await Property.create(
      {
        title,
        description,
        capacity,
        image,
        rating,
        tenant_property,
        client_property,
      },
      {
        includes: [
          {
            model: Tenant,
            as: "tenant_property",
            attributes: ["id"],
          },
          {
            model: Client,
            as: "client_property",
            attributes: ["id"],
          },
        ],
      }
    );
    if (newProperty) {
      return res.json({
        message: "Property created successfully",
        data: newProperty,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};
<<<<<<< HEAD
=======

export const getProperty = async (req, res) => {
  try {
    const property = await Property.findAll({
      attributes: ["id", "title", "description", "capacity", "image", "rating"],
      includes: [
        {
          model: Comment,
          as: "property_comment",
          attributes: ["comment"]
        },
      ],
    });
    console.log("property:",property);
    res.json( property );
  } catch (error) {
    console.log(error);
  }
};
>>>>>>> a88c9d16a5087bc8c140de51708f5854532e546c
