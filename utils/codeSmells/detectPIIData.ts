const { Configuration, OpenAIApi } = require("openai");
import { App } from "@octokit/app";
import { getLineDiffs } from "./getLineDiffs";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

const piiComment = `This PR contains PII data that might make us lose our compliance. Please review or remove them.`;

export default async function detectPIIData({
  installationId,
  owner,
  repo,
  issue_number,
  reqUrl,
  reqEmail,
}: {
  prTitle?: string;
  businessLogicSummary?: string;
  installationId: number;
  owner: string;
  repo: string;
  issue_number: number;
  reqUrl: string;
  reqEmail: string;
}) {
  const octokit = await app.getInstallationOctokit(installationId);

  console.log("pii data file called")

  // get the diffs
  const { data: diffFiles } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner,
      repo,
      pull_number: issue_number,
    }
  );

  function getLatestCommitHash() {
    return octokit
      .request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
        owner,
        repo,
        pull_number: issue_number,
      })
      .then((result) => {
        return result.data.head.sha;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const latestCommitHash = await getLatestCommitHash();

  const commentPromises = diffFiles.map(async (file) => {
    const { additions } = getLineDiffs(file.patch ?? "");

    const lines = additions.split("\n");
let lineNumber = 0;

// I also want to test this approach 

// lines.forEach((line, index) => {
//   const matches = line.match(piiRegex);
//   if (matches) {
//     // If there's a match, the line number is the index of the line plus 1 (since line numbers are 1-based)
//     lineNumber = index + 1;
//     // Do something with the line number and the matches
//     // For example, you could log it, store it, or use it to create a comment in a code review
//     console.log(`PII found on line ${lineNumber}:`, matches);
//   }
// });

    // PII Data RegEx
    // const piiRegex = "\b(age|dob|date_of_birth|birthdate|postal_code|postal-code|PostalCode|zipcode|zip-code|ZipCode|address|street|city|state|country|ssn|social_security_number|SocialSecurityNumber|social-security-number|email|e-mail|phoneNumber|phone-number|Phone_Number|medical_record|MedicalRecord|medical-record|health_insurance|HealthInsurance|health-insurance|patient_id|PatientID|patient-id)\b|\b\d{3}-\d{2}-\d{4}\b|\b\d{3}-\d{3}-\d{4}\b|[\w.-]+@[\w.-]+\.\w{2,}"
    const piiRegex = new RegExp("\\b(age|dob|date_of_birth|birthdate|postal_code|postal-code|PostalCode|zipcode|zip-code|ZipCode|address|street|city|state|country|ssn|social_security_number|SocialSecurityNumber|social-security-number|email|e-mail|phoneNumber|phone-number|Phone_Number|medical_record|MedicalRecord|medical-record|health_insurance|HealthInsurance|health-insurance|patient_id|PatientID|patient-id)\\b|\\b\\d{3}-\\d{2}-\\d{4}\\b|\\b\\d{3}-\\d{3}-\\d{4}\\b|[\\w.-]+@[\\w.-]+\\.\\w{2,}", "g");
    const matches = additions.match(piiRegex);

    if (matches) {
      const firstMatch = matches[0];

      // Find the position of the start of the comment, then split the additions into lines
      const startPos = additions.indexOf(firstMatch);
      const lines = additions.split("\n");

      // This is very important
      // lineNumber is not the position of the comment in the file, but the line number in the diff (this is on the Octokit docs)
      // What's important to note here is that after the header that contains a "@@" on the GitHub code review UI, GitHub adds 3 lines before the code diff. So that's why we need to index this variable at 4.
      let lineNumber = 4;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(firstMatch)) {
          lineNumber = i + 1;
          break;
        }
      }

      await octokit
        .request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
          owner,
          repo,
          pull_number: issue_number,
          commit_id:
            typeof latestCommitHash === "string" ? latestCommitHash : undefined,
          event: "COMMENT",
          path: file.filename,
          comments: [
            {
              path: file.filename,
              position: lineNumber, // comment at the beggining of the file by default
              body: piiComment,
            },
          ],
        })
        .catch((err) => {
          throw err;
        });
    }
  });
  try {
    await Promise.allSettled(commentPromises);
  } catch {}
}
