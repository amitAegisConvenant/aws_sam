const AWS = require("aws-sdk")

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;



const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});

exports.deleteUser = async (event, context) =>{
    let statusCode;
    let body;
    const params = {
        TableName : USER_TABLE,
        Key:{
            id:event.pathParameters.id,
        }
    }

    try{
        await dynamoDB.delete(params).promise();
        body = `User deleted with ID : ${event.pathParameters.id}`;
        statusCode = 200;
    }catch(err){
        console.log("Error :", err.message);
        statusCode = 400;
        body = 'User Not Found, Please provide a valid ID!';
    }


    return {
        body,
        statusCode
    }
}