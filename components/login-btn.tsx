"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
export default function LogInBtn() {
  const serviceList = [
    {
      name: "GitHub",
      image: "/logos/github.svg",
    },
    {
      name: "GitLab",
      image: "/logos/gitlab.svg",
    },
    {
      name: "Bitbucket",
      image: "/logos/bitbucket.svg",
    },
    {
      name: "Slack",
      image: "/logos/slack.svg",
    },
    {
      name: "Notion",
      image: "/logos/notion.svg",
    },
    {
      name: "Confluence",
      image: "/logos/confluence.svg",
    },
    {
      name: "Jira",
      image: "/logos/jira.svg",
    },
    {
      name: "Linear",
      image: "/logos/linear.svg",
    },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      }}
    >
      <div
        className="d-flex flex-items-center flex-justify-center flex-column"
        style={{ height: "100vh" }}
      >
        <div
          className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
          style={{ maxWidth: "80ch" }}
        >
          <Image
            src="/logos/watermelon.png"
            alt="Watermelon Tools"
            width="36"
            height="23"
          />
          <h1 className="h3 mb-3 f4 text-normal">Watermelon Auth</h1>
          <p className="text-gray mb-4">
            Sign in to Watermelon Auth to access all services
          </p>
          <button className="btn btn-primary" onClick={() => signIn()}>
            Sign in
          </button>
        </div>

        <a href="https://github.com/apps/watermelon-context" target="_blank">
          <div
            className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
            style={{ maxWidth: "80ch" }}
          >
            <h2 className="h3 mb-3 f4 text-normal">Try our GitHub App</h2>
            <p className="text-gray mb-4">
              Connect all your services to view context on each PR.
            </p>
          </div>
        </a>
      </div>
      <div className="d-flex flex-column flex-justify-center" style={{}}>
        <h2 className="m-2">Our services:</h2>
        <div
          className="m-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {serviceList.map((service) => (
            <div
              className="Box d-flex flex-items-center flex-justify-center flex-column p-4"
              style={{ width: "20ch" }}
            >
              <Image
                src={service.image}
                alt={service.name}
                width="36"
                height="23"
              />
              <span className="h3 mb-3 f4 text-normal">{service.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
