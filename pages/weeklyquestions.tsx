import { useEffect, useState } from "react";
import Select from 'react-select';

import PagePadder from "../components/PagePadder";
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
      <PagePadder>
        <p>Here you can see all the example questions we have for you</p>
        <div className="flex sm:flex-col md:flex-row">
          <div className="card-style flex flex-col justify-between w-80">
            <h2 className="font-bold text-xl">Language</h2>
            <Select onChange={e => setLang(e.value)} value={langOpts.find(el => el.value === lang)} options={langOpts} />
          </div>
          <div className="card-style flex flex-col justify-between w-80">
            <div>
              <h2 className="font-bold text-xl">Question Type</h2>
            </div>
            <Select onChange={e => setCat(e.value)} value={catOpts.find(el => el.value === cat)} options={catOpts} />
          </div>
        </div>
        {filteredQuestions.map(question => <SlackQuestionDemo question={question} />)}
      </PagePadder>
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