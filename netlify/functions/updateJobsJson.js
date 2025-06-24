const fetch = require("node-fetch");

exports.handler = async (event) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.REPO_NAME;
  const branch = "main";
  const filePath = "js/jobs.json"; // update path based on your repo layout

  const { newJob } = JSON.parse(event.body);

  const fileUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const fileRes = await fetch(fileUrl, {
    headers: { Authorization: `token ${token}` },
  });

  const fileData = await fileRes.json();
  const content = Buffer.from(fileData.content, 'base64').toString();
  const jobs = JSON.parse(content);

  jobs.push(newJob);
  const updatedContent = Buffer.from(JSON.stringify(jobs, null, 2)).toString("base64");

  const updateRes = await fetch(fileUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Add new job: ${newJob.title}`,
      content: updatedContent,
      sha: fileData.sha,
      branch,
    }),
  });

  if (!updateRes.ok) {
    return { statusCode: 500, body: await updateRes.text() };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
