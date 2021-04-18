import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import SlackQuestionDemo from "../components/SlackQuestionDemo";


const WeeklyQuestions = ({ firebaseApp, questions }: { firebaseApp: any; questions: any[] }) => {
  const langOpts = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
  ]

  const catOpts = [
    { value: "hobbies", label: "Hobbies" },
    { value: "profDev", label: "Professional Development" },
  ]
  const [lang, setLang] = useState("en")
  const [cat, setCat] = useState("hobbies")
  const [filteredQuestions, setFilteredQuestions] = useState([])
  useEffect(() => {
    let filtered = questions.filter((question) => question.Category === cat && question.Language === lang)
    setFilteredQuestions(filtered)
  }, [lang, cat])

  return (
    <>
      <PageTitle pageTitle="Questions" />
      <p>Here you can see all the example questions we have for you</p>
      {filteredQuestions.map(question => <SlackQuestionDemo question={question} />)}
    </>
  );
};

export default WeeklyQuestions;
const Airtable = require('airtable');

export async function getServerSideProps(context) {
  let questions = []

  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
  });
  let base = Airtable.base('appyNw8U8LEBl4iPs');
  await base('en').select().eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      questions.push(record.fields)
    });
    fetchNextPage();
  });
  await base('es').select().eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      questions.push(record.fields)
    });
    fetchNextPage();
  });

  return {
    props: {
      questions
    }, // will be passed to the page component as props
  };
}