import { POST } from "../../../app/api/hover/getHoverData/route";

describe("hover", () => {
  let fullReqObject = {
    email: "tulia@watermelon.tools",
    repo: "watermelon",
    owner: "watermelon",
    gitSystem: "github",
    commitTitle: "test",
  };
  it("returns an error when email parameter is missing", async () => {
    const mockReq: any = {
      json: async () => ({ ...fullReqObject, email: undefined }),
    };
    let res;
    const response = await POST(mockReq);
    expect(response.status).toEqual(400);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      error: "Missing parameters: email",
    });
  });
  it("returns an error when repo parameter is missing", async () => {
    const mockReq: any = {
      json: async () => ({ ...fullReqObject, repo: undefined }),
    };
    const response = await POST(mockReq);
    expect(response.status).toEqual(400);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      error: "Missing parameters: repo",
    });
  });
  it("returns an error when owner parameter is missing", async () => {
    const mockReq: any = {
      json: async () => ({ ...fullReqObject, owner: undefined }),
    };
    const response = await POST(mockReq);
    expect(response.status).toEqual(400);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      error: "Missing parameters: owner",
    });
  });
  it("returns an error when gitSystem parameter is missing", async () => {
    const mockReq: any = {
      json: async () => ({ ...fullReqObject, gitSystem: undefined }),
    };
    const response = await POST(mockReq);
    expect(response.status).toEqual(400);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      error: "Missing parameters: gitSystem",
    });
  });
  it("returns an error when commitTitle parameter is missing", async () => {
    const mockReq: any = {
      json: async () => ({ ...fullReqObject, commitTitle: undefined }),
    };
    const response = await POST(mockReq);
    expect(response.status).toEqual(400);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      error: "Missing parameters: commitTitle",
    });
  });
  it.skip("returns hover data when all parameters are present", async () => {
    const mockReq: any = {
      json: async () => ({ ...fullReqObject }),
    };
    const response = await POST(mockReq);
    expect(response.status).toEqual(200);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      data: {
        github: {
          owner: "watermelon",
          repo: "watermelon",
          commitTitle: "test",
        },
        jira: {
          owner: "watermelon",
          repo: "watermelon",
          commitTitle: "test",
        },
        slack: {
          owner: "watermelon",
          repo: "watermelon",
          commitTitle: "test",
        },
      },
    });
  });
});
