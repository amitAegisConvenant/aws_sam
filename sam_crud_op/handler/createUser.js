const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;



const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});


const uuid = require("uuid");


exports.createUser = async (event, context)=>{
    const data = JSON.parse(event.body);

    let body;
    let statusCode = 200;
    let response;

    const headers = {
        "Content-type" : "application/json",
    }

    const params = {
        TableName : USER_TABLE,
        Item:{
            id: uuid.v1(),
            username: data.username,
            age:data.age,
        }
    }


    try{
        body = await dynamoDB.put(params).promise();
        body = "User Created Successfully!"
    }catch(err){
        statusCode = 400;
        body = err.message;
        console.log(err);
    }finally{
        body = JSON.stringify(body);
    }

    response = {
        statusCode,
        body,
        headers
    }

    return response;

}
