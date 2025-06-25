console.log("validateAdmin.js ran successfully!");

exports.handler = async (event) => {
    const { user, pass } = JSON.parse(event.body);
    console.log(`username:${user}, passeord:${pass}`);
    console.log(`process.env.ADMIN_USER:${process.env.ADMIN_USER}, process.env.ADMIN_PASSWORD:${process.env.ADMIN_PASSWORD}`);

    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }
    return { statusCode: 401, body: JSON.stringify({ success: false }) };
};
