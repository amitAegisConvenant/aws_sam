const AWS = require("aws-sdk");

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});

exports.listUsers = async (event, context) => {
      
    let body;
    let statusCode;
    let response;

    console.log("Inside the function");

    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: USER_TABLE,
    };

    try {
        body = await dynamoDB.scan(params).promise();
        console.log("Scan result:", body);
        // body = data;
        statusCode = 200;
    } catch (err) {
        console.error("Error:", err);
        statusCode = 400;
        body = JSON.stringify({ error: err.message });
    }finally{
        body = JSON.stringify(body);
    }

    response = {
        body,
        statusCode,
        headers
    };

    return response;
}
