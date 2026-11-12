import { Link } from 'react-router-dom';

const projects = [
  { tag: 'Civil / Society repair', name: '[Project Name 1]', location: '[Location]', year: 'Completed [Year]' },
  { tag: 'Electrical installation', name: '[Project Name 2]', location: '[Location]', year: 'Completed [Year]' },
  { tag: 'STP / Water treatment', name: '[Project Name 3]', location: '[Location]', year: 'Completed [Year]' }
];

export default function Projects() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="sep">/</span><span>Projects</span></div>
          <span className="eyebrow">Projects / Portfolio</span>
          <h1>Our work</h1>
          <p>Add real project photos and details here.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Project Portfolio</span>
            <h2>Selected projects</h2>
            <p>Replace these placeholders with verified project names, locations, completion years and real site photos before publishing.</p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <div className="pbody">
                  <span className="ptag">{project.tag}</span>
                  <h3>{project.name}</h3>
                  <p>{project.location}</p>
                  <p>{project.year}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-sand">
        <div className="container">
          <div className="cta-band">
            <h2>Have a project to discuss?</h2>
            <p>Contact Uprising Infra LLP to arrange a site visit and quotation.</p>
            <div className="cta-actions"><Link to="/contact" className="btn btn-light"><span>Contact Us</span></Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
