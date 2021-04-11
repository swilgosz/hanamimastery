import CourseAd from '../features/course-ad';

export default function Home() {
  return (
    <div>
      <section
        className="hero has-background-image"
        style={{ backgroundImage: `url("/home-cover.jpg")` }}
      >
        <div className="cover social">
          <img src="/home-cover.jpg" alt="Driggl" />
        </div>
        <div className="hero-body has-mask">
          <div className="container has-text-right">
            <h1 className="title">Wanna be a developer?</h1>
            <a
              href="#courses"
              className="button is-primary has-text-weight-bold is-large"
            >
              Check out our courses!
            </a>
          </div>
        </div>
      </section>
      <section className="section hero">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h2 className="title">
              Experienced & Trusted by
              <strong>
                <span className="has-text-orange">1000+</span>
              </strong>
              People worldwide
            </h2>
            <a
              href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
              className="button is-primary has-text-weight-bold is-large"
            >
              Start learning now!
            </a>
          </div>
        </div>
      </section>
      <section id="courses" className="section">
        <CourseAd />
      </section>
      <section className="hero section">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h2 className="title">Not sure if it&apos;s for you?</h2>
            <h3 className="subtitle">
              No worries, we offer
              <strong>
                <span className="has-text-orange">30-day</span>
              </strong>
              money-back!
            </h3>
            <a
              href="https://www.udemy.com/ruby-on-rails-api-the-complete-guide/?couponCode=DGLWEB"
              className="button is-primary has-text-weight-bold is-large"
            >
              Check it out!
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
