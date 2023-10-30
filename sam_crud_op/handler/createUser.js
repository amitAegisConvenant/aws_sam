const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;
const REGION_NAME = process.env.REGION_NAME;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;


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
            id: {S: uuid.v1()},
            userName: {S: data.username},
            age:{S: data.age},
        }
    }

    console.log(END_POINT, REGION_NAME, USER_TABLE)
    console.log(typeof data, data);

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
