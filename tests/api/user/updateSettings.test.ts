import { POST } from "../../../app/api/user/updateSettings/route";
import patchUserSettings from "../../../utils/db/user/patchUserSettings";

jest.mock("../../../utils/db/user/patchUserSettings");

const mockedPatchUserSettings = patchUserSettings as jest.Mock;
mockedPatchUserSettings.mockResolvedValue({
  userSettings: {
    AISummary: true,
    JiraTickets: 5,
    SlackMessages: 5,
    GitHubPRs: 5,
    NotionPages: 5,
    LinearTickets: 5,
    ConfluenceDocs: 5,
  },
});
describe("User Route POST function", () => {
  it("returns an error when email and userSettings parameters are missing", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({}),
    };
    const response = await (await POST(mockReq)).json();
    expect(response).toEqual({
      error: "Missing parameters: email, userSettings",
    });
  });
  it("returns an error when email parameter is missing", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({
        userSettings: {
          AISummary: true,
          JiraTickets: 3,
          SlackMessages: 3,
          GitHubPRs: 3,
          NotionPages: 3,
          LinearTickets: 3,
          ConfluenceDocs: 3,
        },
      }),
    };
    const response = await (await POST(mockReq)).json();
    expect(response).toEqual({
      error: "Missing parameters: email",
    });
  });
  it("returns an error when userSettings parameter is missing", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({
        email: "tulia@watermelontools.com",
      }),
    };

    const response = await (await POST(mockReq)).json();
    expect(response).toEqual({
      error: "Missing parameters: userSettings",
    });
  });

  it("Updates the userSettings", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({
        email: "tulia@watermelontools.com",
        userSettings: {
          AISummary: true,
          JiraTickets: 5,
          SlackMessages: 5,
          GitHubPRs: 5,
          NotionPages: 5,
          LinearTickets: 5,
          ConfluenceDocs: 5,
        },
      }),
    };

    const response = await (await POST(mockReq)).json();
    expect(response).toEqual({
      userSettings: {
        AISummary: true,
        JiraTickets: 5,
        SlackMessages: 5,
        GitHubPRs: 5,
        NotionPages: 5,
        LinearTickets: 5,
        ConfluenceDocs: 5,
      },
    });
  });
});
