const AWS = require("aws-sdk");

const USER_TABLE = process.env.USER_TABLE;
const END_POINT = process.env.END_POINT;

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: END_POINT,
});



exports.listUsers = async (event, context) => {
      
    let body;
    let statusCode;

    console.log("Inside the function");

    const headers = {
        "Content-Type": "application/json",
    };

    const params = {
        TableName: USER_TABLE,
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        console.log("Scan result:", data);
        body = JSON.stringify(data);
        statusCode = 200;
    } catch (err) {
        console.error("Error:", err);
        statusCode = 400;
        body = JSON.stringify({ error: err.message });
    }

    return {
        statusCode,
        body,
        headers
    };
}
