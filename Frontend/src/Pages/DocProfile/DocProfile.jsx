import React, { useState } from 'react';
import './DocProfile.css'; // Include this to style the components (CSS from your original)
import { assets } from '../../assets/assets';
import IonIcon from '@reacticons/ionicons';

const DocProfile = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState({});
  const [filter, setFilter] = useState('all');
  const [formValid, setFormValid] = useState(false);
  const [activePage, setActivePage] = useState('about');

  const testimonials = [
    {
      avatar: 'https://lawsium.com/wp-content/uploads/2024/01/lawyer-7.jpg',
      name: 'Sarah Thompson',
      date: '5 March, 2023',
      text: 'Dr. Jane provided the support and care I needed during my battle with anxiety. She listened carefully and guided me through tough moments.',
    },
    {
      avatar: 'data:image/jpeg;base64,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',
      name: 'David Martinez',
      date: '12 April, 2023',
      text: 'Dr. Jane is a compassionate and knowledgeable psychiatrist. Her therapy techniques helped me gain control over my depression.',
    },
    {
      avatar: 'https://res.cloudinary.com/dbhwmmzmi/image/upload/v1726414470/oa5ac9phedcxibm7pz9j.png',
      name: 'Jessica Lee',
      date: '25 May, 2023',
      text: 'After struggling with PTSD for years, I finally found relief through Dr. Jane’s therapy sessions. She made a real difference in my life.',
    },
    {
      avatar: 'https://img.rasset.ie/0015102b-1200.jpg',
      name: 'James Anderson',
      date: '10 June, 2023',
      text: 'I’ve been in therapy with Dr. Jane for six months, and I’m now able to manage my stress and anxiety much better. Highly recommend her!',
    },
    {
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnci0BqY8r2RwNTpNXnq7fyB7Ef5AiFfLIwrifUSx_oQARiw-WHDd0DHNwx8Oqg4Gfkrg&usqp=CAU',

      name: 'Olivia Brown',
      date: '15 August, 2023',
      text: 'Dr. Jane is an expert in her field, and her approach to cognitive-behavioral therapy has been incredibly helpful in my recovery process.',
    }
  ];

  const handleSidebarToggle = () => setSidebarActive(!sidebarActive);
  const handleModalOpen = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setModalActive(true);
  };
  const handleModalClose = () => setModalActive(false);
  const handleFilterChange = (value) => setFilter(value);

  const handleFormChange = (e) => {
    const form = e.target.form;
    setFormValid(form.checkValidity());
  };
  return (
    <main className='doc-profile-container'>
      {/* Sidebar */}
      <aside className={`sidebar-doc ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-doc-info">
          <figure className="avatar-box">
            <img src="https://res.cloudinary.com/dbhwmmzmi/image/upload/v1714233766/ht1lvmjstrr6k7orburx.png" alt="Dr. Jane Doe" width="80" />
          </figure>
          

          <div className="info-content">
            <h1 className="name" title="Dr. Jane Doe">Dr. Jane Doe</h1>
            <p className="title">Psychiatrist</p>
          </div>

          <button className="info_more-btn" onClick={handleSidebarToggle}>
            <span>Show Contacts</span>
            <IonIcon name="chevron-down"></IonIcon>
          </button>
        </div>

        <div className={`sidebar-doc-info_more ${sidebarActive ? 'active' : ''}`}>
          <div className="separator"></div>

          <ul className="contacts-list">
            <li className="contact-item">
              <div className="icon-box">
                <IonIcon name="mail-outline"></IonIcon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Email</p>
                <a href="mailto:dr.jane@example.com" className="contact-link">dr.jane@example.com</a>
              </div>
            </li>
            <li className="contact-item">
              <div className="icon-box">
                <IonIcon name="phone-portrait-outline"></IonIcon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Phone</p>
                <a href="tel:+12135551234" className="contact-link">+1 (213) 555-1234</a>
              </div>
            </li>
            <li className="contact-item">
              <div className="icon-box">
                <IonIcon name="calendar-outline"></IonIcon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Birthday</p>
                <time datetime="1980-05-12">May 12, 1980</time>
              </div>
            </li>
            <li className="contact-item">
              <div className="icon-box">
                <IonIcon name="location-outline"></IonIcon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Location</p>
                <address>New York, NY, USA</address>
              </div>
            </li>
          </ul>

          
        </div>
      </aside>

      {/* Pages */}
      <div className="main-content">
        {activePage === 'about' && (
          <article className="about active" data-page="about">
            {/* Navbar */}
            <nav className="nav-doc">
              <ul className="nav-doc-list">
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'about' ? 'active' : ''}`} onClick={() => setActivePage('about')}>About</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'resume' ? 'active' : ''}`} onClick={() => setActivePage('resume')}>Resume</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'blog' ? 'active' : ''}`} onClick={() => setActivePage('blog')}>Blog</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'contact' ? 'active' : ''}`} onClick={() => setActivePage('contact')}>Contact</button>
                </li>
              </ul>
            </nav>
            <header>
              <h2 className="h2 article-title">About me</h2>
            </header>

            <section className="about-text">
              <p>I am a board-certified psychiatrist specializing in mental health and wellness. With over 15 years of experience, I am dedicated to helping individuals overcome their mental health challenges through evidence-based treatments, compassionate care, and holistic approaches.</p>
              <p>My focus is on treating anxiety, depression, PTSD, and other mental health conditions through a combination of psychotherapy and medication management. My goal is to create a safe and supportive environment for all my patients.</p>
            </section>

            <section className="service">
              <h3 className="h3 service-title">What I offer</h3>
              <ul className="service-list">
                <li className="service-item">
                  <div className="service-icon-box">
                    <img src={assets.therapies} alt="Therapy icon" width="40" />
                  </div>
                  <div className="service-content-box">
                    <h4 className="h4 service-item-title">Psychotherapy</h4>
                    <p className="service-item-text">Providing individual and group therapy to help manage stress, anxiety, and emotional challenges.</p>
                  </div>
                </li>
                <li className="service-item">
                  <div className="service-icon-box">
                    <img src={assets.medication} alt="Medication icon" width="40" />
                  </div>
                  <div className="service-content-box">
                    <h4 className="h4 service-item-title">Medication Management</h4>
                    <p className="service-item-text">Comprehensive medication management to address chemical imbalances and improve mental health.</p>
                  </div>
                </li>
                <li className="service-item">
                  <div className="service-icon-box">
                    <img src={assets.consult} alt="Consultation icon" width="40" />
                  </div>
                  <div className="service-content-box">
                    <h4 className="h4 service-item-title">Mental Health Consultations</h4>
                    <p className="service-item-text">Initial consultations to assess mental health needs and create personalized treatment plans.</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* Testimonials */}
            <section className="testimonials">
              <h3 className="h3 testimonials-title">Testimonials</h3>
              <ul className="testimonials-list has-scrollbar">
                {testimonials.map((testimonial, index) => (
                  <li className="testimonials-item" key={index} onClick={() => handleModalOpen(testimonial)}>
                    <div className="content-card">
                      <figure className="testimonials-avatar-box">
                        <img src={testimonial.avatar} alt={testimonial.name} width="60" />
                      </figure>
                      <h4 className="h4 testimonials-item-title">{testimonial.name}</h4>
                      <p className="testimonials-text">{testimonial.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        )}

        {activePage === 'resume' && (
          <article className="resume active" data-page="resume">
            {/* Navbar */}
            <nav className="nav-doc">
              <ul className="nav-doc-list">
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'about' ? 'active' : ''}`} onClick={() => setActivePage('about')}>About</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'resume' ? 'active' : ''}`} onClick={() => setActivePage('resume')}>Resume</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'blog' ? 'active' : ''}`} onClick={() => setActivePage('blog')}>Blog</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'contact' ? 'active' : ''}`} onClick={() => setActivePage('contact')}>Contact</button>
                </li>
              </ul>
            </nav>
            <header>
              <h2 className="h2 article-title">Resume</h2>
            </header>

            {/* Education Section */}
            <section className="timeline">
              <div className="title-wrapper">
                <div className="icon-box">
                  <IonIcon name="book-outline"></IonIcon>
                </div>
                <h3 className="h3">Education</h3>
              </div>

              <ol className="timeline-list">
                <li className="timeline-item">
                  <h4 className="h4 timeline-item-title">Harvard Medical School</h4>
                  <span>2006 — 2010</span>
                  <p className="timeline-text">
                    Graduated with honors, specializing in Psychiatry. Completed extensive training in mental health care, therapy, and psychopharmacology.
                  </p>
                </li>
                <li className="timeline-item">
                  <h4 className="h4 timeline-item-title">Stanford University - BS in Psychology</h4>
                  <span>2002 — 2006</span>
                  <p className="timeline-text">
                    Earned a Bachelor of Science degree in Psychology, focusing on cognitive behavior therapy, emotional intelligence, and neuropsychology.
                  </p>
                </li>
              </ol>
            </section>

            {/* Experience Section */}
            <section className="timeline">
              <div className="title-wrapper">
                <div className="icon-box">
                  <IonIcon name="briefcase-outline"></IonIcon>
                </div>
                <h3 className="h3">Experience</h3>
              </div>

              <ol className="timeline-list">
                <li className="timeline-item">
                  <h4 className="h4 timeline-item-title">Consulting Psychiatrist - New York State Hospital</h4>
                  <span>2015 — Present</span>
                  <p className="timeline-text">
                    Lead psychiatrist in the mental health department, providing individual and group therapy for anxiety, depression, and PTSD. Responsible for developing mental health programs and supervising resident psychiatrists.
                  </p>
                </li>
                <li className="timeline-item">
                  <h4 className="h4 timeline-item-title">Private Practice - Psychiatrist</h4>
                  <span>2010 — Present</span>
                  <p className="timeline-text">
                    Offering psychotherapy and medication management to private clients. Specializing in mood disorders, trauma recovery, and stress-related issues.
                  </p>
                </li>
                <li className="timeline-item">
                  <h4 className="h4 timeline-item-title">Adjunct Professor - NYU School of Medicine</h4>
                  <span>2013 — 2018</span>
                  <p className="timeline-text">
                    Taught courses in clinical psychiatry, psychopharmacology, and cognitive behavioral therapy. Mentored students pursuing psychiatry and psychology careers.
                  </p>
                </li>
              </ol>
            </section>
          </article>
        )}
        {activePage === 'blog' && (
          <article className="blog active" data-page="blog">
            {/* Navbar */}
            <nav className="nav-doc">
              <ul className="nav-doc-list">
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'about' ? 'active' : ''}`} onClick={() => setActivePage('about')}>About</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'resume' ? 'active' : ''}`} onClick={() => setActivePage('resume')}>Resume</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'blog' ? 'active' : ''}`} onClick={() => setActivePage('blog')}>Blog</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'contact' ? 'active' : ''}`} onClick={() => setActivePage('contact')}>Contact</button>
                </li>
              </ul>
            </nav>
            <header>
              <h2 className="h2 article-title">Blog</h2>
            </header>

            <section className="blog-posts">
              <ul className="blog-posts-list">
                <li className="blog-post-item">
                  <a href="#">
                    <figure className="blog-banner-box">
                      <img src="data:image/jpeg;base64,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" alt="Managing Stress in Today's World" loading="lazy" />
                    </figure>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <p className="blog-category">Mental Health</p>
                        <span className="dot"></span>
                        <time dateTime="2023-09-10">Sept 10, 2023</time>
                      </div>
                      <h3 className="h3 blog-item-title">Managing Stress in Today's World</h3>
                      <p className="blog-text">
                        Stress is an inevitable part of modern life, but there are practical strategies to reduce its impact on your mental health...
                      </p>
                    </div>
                  </a>
                </li>

                <li className="blog-post-item">
                  <a href="#">
                    <figure className="blog-banner-box">
                      <img src="data:image/jpeg;base64,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" alt="The Importance of Self-Care" loading="lazy" />
                    </figure>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <p className="blog-category">Mental Health</p>
                        <span className="dot"></span>
                        <time dateTime="2023-08-25">Aug 25, 2023</time>
                      </div>
                      <h3 className="h3 blog-item-title">The Importance of Self-Care</h3>
                      <p className="blog-text">
                        Self-care is not a luxury, it's a necessity. Learn how to incorporate simple self-care habits into your daily routine...
                      </p>
                    </div>
                  </a>
                </li>

                <li className="blog-post-item">
                  <a href="#">
                    <figure className="blog-banner-box">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDewW3OjUys07xUmP-3Go9QpdqFXTSZj8sDw&s" alt="Dealing with Anxiety: Tips and Techniques" loading="lazy" />
                    </figure>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <p className="blog-category">Mental Health</p>
                        <span className="dot"></span>
                        <time dateTime="2023-07-15">July 15, 2023</time>
                      </div>
                      <h3 className="h3 blog-item-title">Dealing with Anxiety: Tips and Techniques</h3>
                      <p className="blog-text">
                        Anxiety can be overwhelming, but with the right tools, you can manage it effectively. Here are some techniques to get you started...
                      </p>
                    </div>
                  </a>
                </li>

                <li className="blog-post-item">
                  <a href="#">
                    <figure className="blog-banner-box">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx7pFtz-8fjy643XV7pp8ejVJk-bl8jDmJZA&s" alt="How to Build Emotional Resilience" loading="lazy" />
                    </figure>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <p className="blog-category">Mental Health</p>
                        <span className="dot"></span>
                        <time dateTime="2023-06-05">June 5, 2023</time>
                      </div>
                      <h3 className="h3 blog-item-title">How to Build Emotional Resilience</h3>
                      <p className="blog-text">
                        Emotional resilience is the ability to bounce back from life's challenges. Discover ways to strengthen your mental resilience...
                      </p>
                    </div>
                  </a>
                </li>
              </ul>
            </section>
          </article>
        )}
        {activePage === 'contact' && (
          <article className="contact active" data-page="contact">
            {/* Navbar */}
            <nav className="nav-doc">
              <ul className="nav-doc-list">
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'about' ? 'active' : ''}`} onClick={() => setActivePage('about')}>About</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'resume' ? 'active' : ''}`} onClick={() => setActivePage('resume')}>Resume</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'blog' ? 'active' : ''}`} onClick={() => setActivePage('blog')}>Blog</button>
                </li>
                <li className="nav-doc-item">
                  <button className={`nav-doc-link ${activePage === 'contact' ? 'active' : ''}`} onClick={() => setActivePage('contact')}>Contact</button>
                </li>
              </ul>
            </nav>

            <header>
              <h2 className="h2 article-title">Contact</h2>
            </header>

            {/* Google Maps Section */}
            <section className="mapbox" data-mapbox>
              <figure>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24171.32636552922!2d-74.01127320677015!3d40.70416985001906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a31627a573b%3A0xabc123abc987123f!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1647608789441!5m2!1sen!2sin"
                  width="400"
                  height="300"
                  loading="lazy"
                  title="Google Maps"
                ></iframe>
              </figure>
            </section>

            {/* Contact Form Section */}
            <section className="contact-form">
              <h3 className="h3 form-title">Contact Form</h3>

              <form action="#" className="form" data-form>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="fullname"
                    className="form-input"
                    placeholder="Full name"
                    required
                    data-form-input
                    onChange={(e) => handleFormChange(e)}
                  />

                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Email address"
                    required
                    data-form-input
                    onChange={(e) => handleFormChange(e)}
                  />
                </div>

                <textarea
                  name="message"
                  className="form-input"
                  placeholder="Your Message"
                  required
                  data-form-input
                  onChange={(e) => handleFormChange(e)}
                ></textarea>

                <button className="form-btn" type="submit" disabled={!formValid} data-form-btn>
                  <IonIcon name="paper-plane"></IonIcon>
                  <span>Send Message</span>
                </button>
              </form>
            </section>
          </article>
        )}


        {/* Other sections such as Resume, Blog, and Contact remain as in the original */}
      </div>
    </main>
  );
};

export default DocProfile;
