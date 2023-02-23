/**
 * TODO: RUTAS A CREAR
 * ! Post: crear tenant => nombre, email, password, verfy, avatar, rol: 1 -> client 2 -> admin
 * ! Post: login => email, password
 * ! Get: userinfo por id => id, nombre, email, avatar
 * ! Post: Registro port gmail
 */

import express from "express";
import { Tenant } from "../../models/tenant.model.js";
import { Client } from "../../models/client.model.js";
import { Aboutme } from "../../models/aboutme.model.js";
import { Property } from "../../models/property.model.js";
import { sendEmail } from "../Nodemailer/nodemailer.controller.js";
import { Payments } from "../../models/payment.model.js";
import bcrypt from "bcrypt";
const app = express();
import jwt from "jsonwebtoken";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();
app.set("view engine", "ejs");
var nodemailer = require("nodemailer");

const secretjwt =
  "5e6fa1b1bfd5a93c5e7ae001e4c96794c0e8f004095074b42608dc3a0acb67574e2821518d6638eef13c9f882408c861f9cc09e603439e9a93aae6a2b9146e44";

export const createTenant = async (req, res) => {
  const { firebaseUrl } = req.file ? req.file : "";
  const { fullName, email, password, verify, phone, role } = req.body;

  // ! Encrypt password
  const salt = await bcrypt.genSalt(10);
  const passwordCrypt = await bcrypt.hash(password, salt);
  try {
    //const searchPhone = await Tenant.findOne({ where: { phone } });
    const searchEmail = await Tenant.findOne({ where: { email } });
    if (searchEmail) return res.status(400).json({ message: "Email exists" });
    //if (searchPhone) return res.status(400).json({ message: "Phone exists" });

    let newClient = await Tenant.create({
      fullName,
      email,
      password: passwordCrypt,
      verify,
      avatar: firebaseUrl,
      phone,
      role,
    });
    if (newClient) {
      sendEmail(newClient, role);
      return res.json({
        message: "Tenant created successfully",
        data: newClient,
        token: secretjwt,
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Tenant.findOne({ where: { email } });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, secretjwt, {
      expiresIn: "1h",
    });

    const role = user.role;
    const avatar = user.avatar;
    const userId = user.id;
    const fullName = user.fullName;

    if (res.status(201)) {
      return res.json({
        status: "ok",
        data: token,
        role: role,
        avatar: avatar,
        userId: userId,
        fullName,
      });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
};

export const tenantData = async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, secretjwt, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    Tenant.findOne({ where: { email: useremail } })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const forgot = async (req, res) => {
  const { email } = req.body;

  if (!validateEmail)
    return res.status(400).send({ message: "email no valido" });
  try {
    const oldUser = await Tenant.findOne({ where: { email } });
    if (!oldUser) {
      return res.status(400).json({ status: "No existe ese usuario" });
    }
    const secret = secretjwt + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "10m",
    });
    const link = `http://127.0.0.1:3000/tenant/reset/${oldUser.id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lookingplace.app.henry2@gmail.com",
        pass: "rtmxlgfasbphaafd",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
      <div style="border: 4px solid #0099CC; border-radius: 10px; padding: 20px; max-width: 500px; margin: auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333;">
        <div style="text-align: center;">
          <img src="https://thumbs2.imgbox.com/f0/b1/ukj3hkGl_t.jpg" alt="LookingPlace" style="max-width: 200px; height: auto;">
          <h1 style="color: #0099CC; font-size: 32px; margin: 10px 0;">LookingPlace</h1>
        </div>
        <p>Estimado ${email},</p>
        <p>Para recuperar su contraseña haga click en el siguiente boton:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" style="background-color: #0099CC; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Recupere contraseña aqui</a>
        </div>
        <p style="text-align: center; font-size: 14px;">LookingPlace | 123 Main St | Ciudad, Estado | +1-234-567-8901</p>
      </div>
      `,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error("Ha ocurrido un error:", err);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json("El email para la recuperación ha sido enviado");
      }
    });

    console.log(link);
  } catch (error) {
    res.status(500).send({
      message: "ha ocurrido un error",
      error,
    });
  }
};

export const verifyPassword = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await Tenant.findOne({ where: { id } });
  if (!oldUser) {
    return res.json({ status: "No existe ese usuario" });
  }
  const secret = secretjwt + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email });
  } catch (error) {
    console.log(error);
    res.send("Not verified");
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await Tenant.findOne({ where: { id } });
  if (!oldUser) {
    return res.json({ status: "No existe ese usuario" });
  }
  const secret = secretjwt + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await Tenant.update(
      { password: encryptedPassword },
      { where: { id: id } }
    ).then(() => {
      console.log("Password update succcesfuly");
    });
    res.redirect("http://127.0.0.1:5173/login");
    //res.render("index", { email: verify.email });
  } catch (error) {
    console.log(error);
    res.json({ status: "Algo salió mal" });
  }
};

export const getTenant = async (req, res) => {
  try {
    const client = await Tenant.findAll({
      attributes: [
        "id",
        "fullName",
        "email",
        "avatar",
        "phone",
        "role",
        "isPro",
      ],
      include: [
        {
          model: Aboutme,
          as: "Aboutmes",
          attributes: ["id", "description", "hobbies", "age", "from"],
        },
      ],
    });
    res.json(client);
  } catch (error) {
    console.log(error);
  }
};

export const getTenantById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Tenant.findOne({
      where: { id },
      attributes: [
        "id",
        "fullName",
        "email",
        "avatar",
        "phone",
        "role",
        "isPro",
      ],
      include: [
        {
          model: Aboutme,
          as: "Aboutmes",
          attributes: ["id", "description", "hobbies", "age", "from"],
        },
        {
          model: Property,
        },
        {
          model: Payments,
          attributes: ["id", "description", "amount", "status", "type"],
          include: [
            {
              model: Client,
              attributes: ["id", "fullName", "email", "phone"],
            },
          ],
        },
      ],
    });
    res.json(client);
  } catch (error) {
    console.log(error);
  }
};

export const updateTenant = async (req, res) => {
  //  patch  && avatar upload req.files
  const { id } = req.params;
  let { fullName, phone, description, hobbies, age, from, role } = req.body;
  try {
    // setear age a number
    if (age) parseInt(age);
    // setear hobbie de json a array
    if (hobbies) hobbies = JSON.parse(hobbies);

    const client = await Tenant.findOne({
      where: { id },
    });

    if (!client) return res.status(400).json({ message: "Client not found" });
    const aboutme = await Aboutme.findOne({
      where: { tenant_about: id },
    });

    if (client) {
      await Tenant.update(
        {
          fullName,
          phone,
          role,
        },
        {
          where: { id },
        }
      );
      if (!aboutme) {
        await Aboutme.create({
          description,
          hobbies,
          age,
          from,
          tenant_about: id,
        });
      } else {
        await Aboutme.update(
          {
            description,
            hobbies,
            age,
            from,
          },
          {
            where: { tenant_about: id },
          }
        );
      }
      res.json({
        message: "Client updated successfully",
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

export const updateAvatar = async (req, res) => {
  const { firebaseUrl } = req.file ? req.file : "";
  const { id } = req.params;
  console.log(firebaseUrl);

  try {
    const client = await Tenant.findOne({
      where: { id },
    });

    if (!client) return res.status(400).json({ message: "Client not found" });
    if (client) {
      await Tenant.update(
        {
          avatar: firebaseUrl,
        },
        {
          where: { id },
        }
      );

      res.json({
        message: "Client updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteTenant = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteRowCount = await Tenant.destroy({
      where: { id },
    });
    res.json({
      message: "Tenant deleted successfully",
      count: deleteRowCount,
    });
  } catch (error) {
    console.log(error);
  }
};

export const validateTenant = async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await Tenant.findOne({
      where: { email, password },
    });

    if (client) {
      return res.json({
        message: "Tenant found successfully",
        data: client,
        token: jsonw,
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

//  para suscription

export const patchProTenant = async (req, res) => {
  console.log(req.body);
  const { id, pro } = req.body;
  console.log("Soy Id", id, "pro", pro);
  try {
    let searchTenant = await Tenant.findOne({
      where: { id },
    });
    await searchTenant.update({ isPro: pro });

    res.json("Tenant Actualizado a Pro - IdTenant : " + id);
  } catch (e) {
    return res.status(404).json({
      message: "Something goes wrong",
      error: e,
    });
  }
};
