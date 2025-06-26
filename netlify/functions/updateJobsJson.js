// console.log("updateJobsJson.js ran successfully!");
// const fetch = require('node-fetch');
// console.log(`fetch:${fetch}`);

// exports.handler = async (event) => {
//   try {
//     const token = process.env.GITHUB_TOKEN;
//     const repo = process.env.REPO_NAME;
//     const branch = "main";
//     const filePath = "js/jobs.json";

//     console.log("updateJobsJson.js ran successfully!");
//     console.log(`token:${token} repo:${repo} branch:${branch} filepath:${filePath}`)
//     console.log(`event.body: ${event.body}`)

//     const { newJob } = JSON.parse(event.body);

//     const fileUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
//     console.log(`fileUrl:${fileUrl}`);


//     // const fileRes = await fetch(fileUrl, {
//     //   headers: { Authorization: `token ${token}` },
//     // });

//     const fileRes = await fetch(fileUrl, {
//       headers: {
//         Authorization: `token ${token}`,
//         Accept: 'application/vnd.github.v3+json'
//       }
//     });

//     if (!fileRes.ok) {
//       const errorText = await fileRes.text(); // Read raw error message
//       console.error('Failed to fetch file from GitHub:', fileRes.status, errorText);
//       return {
//         statusCode: fileRes.status,
//         body: JSON.stringify({ message: 'Failed to fetch file', error: errorText }),
//       };
//     }

//     console.log(`fileRes:${fileRes}`);
//     debugger

//     const fileData = await fileRes.json();
//     debugger
//     let jobs = [];
//     if (fileData.content) {
//       const content = Buffer.from(fileData.content, 'base64').toString();
//       debugger
//       jobs = JSON.parse(content);
//     }

//     jobs.push(newJob);
//     const updatedContent = Buffer.from(JSON.stringify(jobs, null, 2)).toString("base64");

//     const updateRes = await fetch(fileUrl, {
//       method: "PUT",
//       headers: {
//         Authorization: `token ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: `Add new job: ${newJob.title}`,
//         content: updatedContent,
//         sha: fileData.sha,
//         branch,
//       }),
//     });

//     if (!updateRes.ok) {
//       return { statusCode: 500, body: await updateRes.text() };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true }),
//     };
//   } catch (error) {
//     console.error("Function error:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Server Error" }),
//     };
//   }
// };

const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.REPO_NAME;
    const branch = "main";
    const filePath = "js/jobs.json";

    const jobs = JSON.parse(event.body); // direct array
    console.log("✅ Parsed jobs:", jobs);

    const fileUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const fileRes = await fetch(fileUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!fileRes.ok) {
      const errorText = await fileRes.text();
      console.error('❌ Failed to fetch file from GitHub:', fileRes.status, errorText);
      return {
        statusCode: fileRes.status,
        body: JSON.stringify({ message: 'Failed to fetch file', error: errorText }),
      };
    }

    const fileData = await fileRes.json();
    const updatedContent = Buffer.from(JSON.stringify(jobs, null, 2)).toString("base64");

    const updateRes = await fetch(fileUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update jobs.json`,
        content: updatedContent,
        sha: fileData.sha,
        branch,
      }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("❌ Failed to update file on GitHub:", errorText);
      return { statusCode: 500, body: errorText };
    }

    console.log("✅ jobs.json successfully updated!");
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error", error: error.message }),
    };
  }
};
