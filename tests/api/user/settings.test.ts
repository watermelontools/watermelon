import { POST } from "../../../app/api/user/settings/route";
import getUserSettings from "../../../utils/db/user/settings";
jest.mock("../../../utils/db/user/settings");

const mockedGetUserSettings = getUserSettings as jest.Mock;
mockedGetUserSettings.mockResolvedValue({
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
  it("returns an error when email parameter is missing", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({}),
    };
    const response = await POST(mockReq);
    expect(response.status).toEqual(400);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      error: "Missing parameters: email",
    });
  });

  it("returns user settings when email parameter is provided", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({ email: "test@example.com" }),
    };
    const response = await POST(mockReq);
    expect(response.status).toEqual(200);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      userSettings: {
        data: {
          AISummary: true,
          JiraTickets: 5,
          SlackMessages: 5,
          GitHubPRs: 5,
          NotionPages: 5,
          LinearTickets: 5,
          ConfluenceDocs: 5,
        },
      },
    });
  });
});
