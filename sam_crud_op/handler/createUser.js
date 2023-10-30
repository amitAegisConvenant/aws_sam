const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;



const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});


const uuid = require("uuid");


exports.createUser = async (event, context)=>{
    // const timeStamp = new Date().getTime();
    const data = JSON.parse(event.body);

    let body;
    let statusCode = 200;

    const headers = {
        "Content-type" : "application/json",
    }

    const params = {
        TableName : USER_TABLE,
        Item:{
            id: uuid.v1(),
            userName: data.username,
            age:data.age,
        }
    }

    // console.log(typeof data, data);

    try{
        body = await dynamoDB.put(params).promise();
    }catch(err){
        statusCode = 400;
        body = err.message;
        console.log(err);
    }finally{
        body = JSON.stringify(body);
    }


    return {
        statusCode,
        body,
        headers
    }

}
