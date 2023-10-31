const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;



const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});

exports.getUser = async (event, context) =>{
    let body;
    let statusCode;

    const params = {
        TableName : USER_TABLE,
        Key:{
            "id":event.pathParameters.id,
        }
    }

    try{
        body = await dynamoDB.get(params).promise();
        statusCode = 200;
    }catch(err){
        statusCode = 400;
        body = err.message;
        console.log(err);
    }finally{
        body = JSON.stringify(body);
    }

    if(body.length < 1){
        body = "User not found!";
    }

    return {
        body,
        statusCode
    }
}