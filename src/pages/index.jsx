/**
 * Inner pages (everything except the homepage), loaded on demand by GDevelopments.jsx.
 * Route names come from matchRoute() there.
 */
import {
  AboutPage, StoryPage, SustainabilityPage, VisionPage,
} from './about.jsx';
import { ContactPage } from './contact.jsx';
import { EntityPage, GroupPage } from './group.jsx';
import { ArticlePage, JournalPage } from './journal.jsx';
import { LeadershipPage } from './leadership.jsx';
import {
  LaunchesPage, ProjectPage, ResidencesPage, UnitsPage,
} from './residences.jsx';
import { NotFound } from './shared.jsx';

export default function RoutePage({ route, openConcierge, onLead }) {
  switch (route.name) {
    case 'residences': return <ResidencesPage />;
    case 'launches': return <LaunchesPage onLead={onLead} />;
    case 'project': return <ProjectPage key={route.slug} slug={route.slug} openConcierge={openConcierge} onLead={onLead} />;
    case 'units': return <UnitsPage key={route.slug} slug={route.slug} openConcierge={openConcierge} />;
    case 'about': return <AboutPage openConcierge={openConcierge} />;
    case 'story': return <StoryPage />;
    case 'vision': return <VisionPage openConcierge={openConcierge} />;
    case 'leadership': return <LeadershipPage key={route.anchor || 'top'} anchor={route.anchor} />;
    case 'sustainability': return <SustainabilityPage openConcierge={openConcierge} />;
    case 'group': return <GroupPage />;
    case 'entity': return <EntityPage key={route.slug} slug={route.slug} />;
    case 'journal': return <JournalPage />;
    case 'article': return <ArticlePage key={route.slug} slug={route.slug} />;
    case 'contact': return <ContactPage onLead={onLead} />;
    default: return <NotFound />;
  }
}
