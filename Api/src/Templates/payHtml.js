const companyName = "LookingPlace";

export const payHtml = `
<div style="border: 4px solid #0099CC; border-radius: 10px; padding: 20px; max-width: 500px; margin: auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333;">
  <div style="text-align: center;">
    <img src="https://thumbs2.imgbox.com/f0/b1/ukj3hkGl_t.jpg" alt="${companyName}" style="max-width: 200px; height: auto;">
    <h1 style="color: #0099CC; font-size: 32px; margin: 10px 0;">${companyName}</h1>
  </div>
  <p>Estimado *fullName*,</p>
  <h2 style="color:green">El Pago se realizo correctamente</h2>
  <hr/>
  <span><strong>Alojamiento rentado:</strong></span><span>*title*</span>
  <p/>
  <span><strong>Total pagado: $USD </strong></span><span style="font-size:28px">*priceTotal*</span>
  <hr/>
  <p>Si tiene alguna pregunta o necesita ayuda en cualquier momento, no dude en ponerse en contacto con nuestro equipo de atención al cliente en cualquier momento. </p>
  <p>Gracias por confiar en LookingPlace para sus necesidades de alojamiento. ¡Disfrute de su estancia!</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="http://127.0.0.1:5173/login" style="background-color: #0099CC; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Explora nuestras opciones de alojamiento</a>
  </div>
  <p style="text-align: center; font-size: 14px;">LookingPlace | 123 Main St | Ciudad, Estado | +1-234-567-8901</p>
</div>
`;
