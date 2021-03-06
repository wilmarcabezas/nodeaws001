const { Client } = require('pg')
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getProducts = async () =>{
    const client = new Client({
        user: process.env.DBUSER,
        host: process.env.DBSERVER,
        database: process.env.DB,
        password: process.env.DBPWD,
        port: process.env.DBPORT,
        ssl:{
            rejectUnauthorized:false,
        }
      })

      await client.connect();

      const res = await client.query("SELECT * FROM app_product where title not like '%ajuste%'");
      //const res = await client.query("SELECT * FROM app_product where ID=11889900");
      
      const result = res.rows;
      await client.end();

      return result;
}

const getProductId = async (id) =>{
    const client = new Client({
        user: process.env.DBUSER,
        host: process.env.DBSERVER,
        database: process.env.DB,
        password: process.env.DBPWD,
        port: process.env.DBPORT,
        ssl:{
            rejectUnauthorized:false,
        }
      })

      await client.connect();

      const res = await client.query("SELECT * FROM app_product where id="+id);
      const result = res.rows;
      await client.end();

      return result;
}

const  updateProduct = async (title, description, price, image, deleted, id,cambio, historia) =>{
    const client = new Client({
        user: process.env.DBUSER,
        host: process.env.DBSERVER,
        database: process.env.DB,
        password: process.env.DBPWD,
        port: process.env.DBPORT,
        ssl:{
            rejectUnauthorized:false,
        }
      })

      await client.connect();
      
      historia=historia+"}";
      var newJsonDataStringyfied = JSON.stringify(historia);
      title = title.replace(","," ");
      description = description.replace(","," ");
      const res = await client.query("UPDATE app_product SET title='"+title+"', description='"+description+"', price="+price+", image='"+image+"', deleted='"+ deleted + "',price_history='"+historia+"' where id="+id);
      
      await client.end();

      return res;
}
const  updateProductNoImg = async (title, description, price, deleted, id, cambio, historia) =>{
    const client = new Client({
        user: process.env.DBUSER,
        host: process.env.DBSERVER,
        database: process.env.DB,
        password: process.env.DBPWD,
        port: process.env.DBPORT,
        ssl:{
            rejectUnauthorized:false,
        }
      })

      await client.connect();
      historia=historia+"}";
      historia=historia.replace("}}","}");
      var newJsonDataStringyfied = JSON.stringify(historia);
      title = title.replace(","," ");
      description = description.replace(","," ");
      console.log(historia);

      const res = await client.query("UPDATE app_product SET title='"+title+"', description='"+description+"', price="+price+", deleted='"+ deleted + "',price_history='"+historia+"' where id="+id);
      
      await client.end();

      return res;
}


app.get('/products',cors(),async (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json(await getProducts());
})

app.get('/products/:id',async (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.params.id);
    res.status(200).json(await getProductId(req.params.id));
})

app.put('/products/:id',cors(),async (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    const data = {
        id:req.body.id,
        title: req.body.title,
        description:req.body.description,
        price:req.body.price,
        image:req.body.image,
        deleted:req.body.deleted,
        cambio:req.body.cambio,
        historia:req.body.historia,
    };

    res.status(200).json(await updateProduct(data.title,data.description,data.price,data.image,data.deleted, data.id, data.cambio,data.historia));
})

app.put('/productsnoimg/:id',cors(),async (req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body.cambio)
    const data = {
        id:req.body.id,
        title: req.body.title,
        description:req.body.description,
        price:req.body.price,
        deleted:req.body.deleted,
        cambio:req.body.cambio,
        historia:req.body.historia,
    };
    //res.status(200).json(req.body);
    res.status(200).json(await updateProductNoImg(data.title,data.description,data.price,data.deleted, data.id, data.cambio, data.historia));
})

const port = process.env.PORT || 3000;

app.listen(port, ()=> {   
    console.log('http://localhost:3000')
      }
  );