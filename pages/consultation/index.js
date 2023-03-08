import HeaderAndFooter from "../../components/HeaderAndFooter";
import { NextSeo } from "next-seo";
import styles from "./index.module.css";
import Copyright from "../../components/Copyright";

const testimonials = [
  {
    text: "Blake coached me to better demonstrate and communicate my problem solving approach during technical interviews. Without his help, I would not have landed an internship with a top FinTech company.",
    name: "Reetesh S.",
  },
  {
    text: "Blake's back-of-the-hand knowledge of Amazon Web Services (AWS) enabled me to migrate my data platform across cloud providers in days instead of months.",
    name: "Dylan M.",
  },
  {
    text: "I had an interest in online sale sniping, but no coding experience. Blake happily and effectively trained me to bridge the gap and accelerate my success rate and profits.",
    name: "Adam C.",
  },
  {
    text: "Blake enlightened my perspective about which Web Development framework best fit my career's focus. I saved months of time and frustration by following his advice.",
    name: "Dylan S.",
  },
];

export default function Consultation() {
  return (
    <HeaderAndFooter>
      {/* 8A70F4 */}
      {/* #00B0ADcc #E58450*/}
      <NextSeo
        title="One-on-One Consultations"
        description="Offering personalized one-on-one consultations surrounding innovative technical solutions"
      />
      <div className={`content ${styles.main}`}>
        <h1>Consultations</h1>
        <h2>
          I thrive in the fulfillment of sharing my technical expertise with
          others. I offer personalized one-on-one consultations to architect and
          adapt innovative technical solutions to your specific needs.
          Currently, I advise aspirational students and professionals across a
          variety of fields, myself specializing in the following domains:
          <ul>
            <li>Task Automation and Virtualization</li>
            <li>Cloud Architecture Design</li>
            {/* <li>Microservice Design</li> */}
            <li>Data Services and Pipelines</li>
            <li>Algorithm Design and Optimization</li>
          </ul>
          Whatever your fascination, dilemma, or goal, my gears are already
          turning.
        </h2>

        {/* <div id=""></div> */}

        <a
          href={`mailto:blake@sanie.com?subject=${encodeURIComponent(
            "Consultation Inquiry"
          )}&body=${encodeURIComponent(
            `Hi Blake,\n\n(Template) I am interested in scheduling a consultation with you... `
          )}`}
          className={styles.callToAction}
        >
          Schedule Consultation
        </a>

        <h3>Testimonials</h3>

        <div className={styles.testimonials}>
          {testimonials.map((testimonial, i) => {
            return (
              <div className={styles.testimonial}>
                <p className={styles.testText}>{testimonial.text}</p>
                <p className={styles.testName}>{testimonial.name}</p>
              </div>
            );
          })}
        </div>
        <Copyright />
      </div>
    </HeaderAndFooter>
  );
}
