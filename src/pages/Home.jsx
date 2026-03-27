import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './Home.module.css';
import cardStyles from '../components/Card.module.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Enhanced animated section wrapper with stagger effect
const AnimatedSection = ({ children, delay = 0 }) => {
    const [ref, isVisible] = useScrollAnimation();
    return (
        <div 
            ref={ref} 
            className={isVisible ? styles.visible : styles.hidden}
            style={{ '--animation-delay': `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const Home = () => {
    return (
        <div className={styles.homepage}>
            {/* --- HERO SECTION --- */}
            <section className={`container-fluid ${styles.heroSection}`}>
                <div className={styles.heroContent}>
                    <AnimatedSection>
                        <h1 className={styles.heroTitle}>
                            Your Journey to 
                            <span className={styles.heroAccent}> Mental Wellness</span>
                            <br />Starts Here
                        </h1>
                        <p className={styles.heroSubtitle}>
                            A safe, confidential space to understand your thoughts, connect with 
                            licensed professionals, and join a supportive community. Take the first 
                            step toward a healthier, happier you.
                        </p>
                        <div className={styles.heroButtons}>
                            <Link to="/register">
                                <Button variant="primary" className={styles.ctaPrimary}>
                                    Start Your Journey Free
                                    <svg className={styles.buttonIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Button>
                            </Link>
                            <Link to="/learn-more">
                                <Button variant="secondary" className={styles.ctaSecondary}>
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
                <div className={styles.heroBackground}>
                    <div className={styles.heroCircle1}></div>
                    <div className={styles.heroCircle2}></div>
                    <div className={styles.heroCircle3}></div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className={`${styles.section} ${styles.featuresSection}`}>
                <div className="container">
                    <AnimatedSection>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Comprehensive Tools for Your Well-Being</h2>
                            <p className={styles.sectionSubtitle}>
                                Evidence-based resources and professional support, all in one secure platform
                            </p>
                        </div>
                    </AnimatedSection>
                    
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <AnimatedSection delay={100}>
                                <Card className={`h-100 ${styles.featureCard}`}>
                                    <div className={cardStyles.cardContent}>
                                        <div className={styles.featureCardBody}>
                                            <div className={styles.featureIcon}>
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M13 11V7a4 4 0 0 0-8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <h3 className={styles.featureTitle}>Private Self-Assessment</h3>
                                            <p className={styles.featureDescription}>
                                                Confidential, evidence-based evaluations to help you understand 
                                                your mental health patterns and identify areas for growth.
                                            </p>
                                            <div className={styles.featureFooter}>
                                                <span className={styles.featureTag}>Confidential</span>
                                                <span className={styles.featureTag}>Evidence-Based</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </AnimatedSection>
                        </div>
                        
                        <div className="col-md-4 mb-4">
                            <AnimatedSection delay={200}>
                                <Card className={`h-100 ${styles.featureCard}`}>
                                    <div className={cardStyles.cardContent}>
                                        <div className={styles.featureCardBody}>
                                            <div className={styles.featureIcon}>
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <h3 className={styles.featureTitle}>Expert Resources</h3>
                                            <p className={styles.featureDescription}>
                                                Curated library of articles, guides, and tools from licensed 
                                                mental health professionals to support your learning journey.
                                            </p>
                                            <div className={styles.featureFooter}>
                                                <span className={styles.featureTag}>Expert-Curated</span>
                                                <span className={styles.featureTag}>Always Updated</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </AnimatedSection>
                        </div>
                        
                        <div className="col-md-4 mb-4">
                            <AnimatedSection delay={300}>
                                <Card className={`h-100 ${styles.featureCard}`}>
                                    <div className={cardStyles.cardContent}>
                                        <div className={styles.featureCardBody}>
                                            <div className={styles.featureIcon}>
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <h3 className={styles.featureTitle}>Professional Support</h3>
                                            <p className={styles.featureDescription}>
                                                Connect with verified, licensed therapists and counselors who 
                                                understand your needs and can provide personalized care.
                                            </p>
                                            <div className={styles.featureFooter}>
                                                <span className={styles.featureTag}>Licensed</span>
                                                <span className={styles.featureTag}>Personalized</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS SECTION --- */}
            <section className={`${styles.section} ${styles.howItWorksSection}`}>
                <div className="container">
                    <AnimatedSection>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>How It Works</h2>
                            <p className={styles.sectionSubtitle}>
                                Simple steps to begin your mental wellness journey
                            </p>
                        </div>
                    </AnimatedSection>
                    
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <AnimatedSection delay={100}>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>
                                        <span>1</span>
                                        <div className={styles.stepRipple}></div>
                                    </div>
                                    <h4 className={styles.stepTitle}>Take Assessment</h4>
                                    <p className={styles.stepDescription}>
                                        Complete our confidential self-assessment to understand your 
                                        current mental health status and identify your needs.
                                    </p>
                                </div>
                            </AnimatedSection>
                        </div>
                        
                        <div className="col-md-4 mb-4">
                            <AnimatedSection delay={200}>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>
                                        <span>2</span>
                                        <div className={styles.stepRipple}></div>
                                    </div>
                                    <h4 className={styles.stepTitle}>Explore Resources</h4>
                                    <p className={styles.stepDescription}>
                                        Access personalized recommendations for articles, exercises, 
                                        and tools based on your assessment results.
                                    </p>
                                </div>
                            </AnimatedSection>
                        </div>
                        
                        <div className="col-md-4 mb-4">
                            <AnimatedSection delay={300}>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>
                                        <span>3</span>
                                        <div className={styles.stepRipple}></div>
                                    </div>
                                    <h4 className={styles.stepTitle}>Connect & Grow</h4>
                                    <p className={styles.stepDescription}>
                                        Join our supportive community or connect with professional 
                                        therapists for ongoing guidance and support.
                                    </p>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className={`${styles.section} ${styles.testimonialsSection}`}>
                <div className="container">
                    <AnimatedSection>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Trusted by Thousands</h2>
                            <p className={styles.sectionSubtitle}>
                                Real stories from people who found their path to wellness
                            </p>
                        </div>
                    </AnimatedSection>
                    
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <AnimatedSection delay={100}>
                                <div className={styles.testimonial}>
                                    <div className={styles.testimonialContent}>
                                        <p className={styles.testimonialText}>
                                            "This platform gave me the courage to seek help. The self-assessment 
                                            helped me understand what I was going through, and connecting with a 
                                            therapist has been life-changing."
                                        </p>
                                        <div className={styles.testimonialAuthor}>
                                            <div className={styles.authorAvatar}>S</div>
                                            <div>
                                                <div className={styles.authorName}>Sarah M.</div>
                                                <div className={styles.authorRole}>Marketing Professional</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                        
                        <div className="col-md-6 mb-4">
                            <AnimatedSection delay={200}>
                                <div className={styles.testimonial}>
                                    <div className={styles.testimonialContent}>
                                        <p className={styles.testimonialText}>
                                            "I love the privacy and the quality of resources. Being able to learn 
                                            at my own pace while knowing professional help was available gave me 
                                            confidence to take control of my mental health."
                                        </p>
                                        <div className={styles.testimonialAuthor}>
                                            <div className={styles.authorAvatar}>M</div>
                                            <div>
                                                <div className={styles.authorName}>Michael R.</div>
                                                <div className={styles.authorRole}>Teacher</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* --- FINAL CTA SECTION --- */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <AnimatedSection>
                        <div className={styles.ctaContent}>
                            <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
                            <p className={styles.ctaSubtitle}>
                                Join thousands who have taken the first step toward better mental health. 
                                Your wellness journey starts with a single click.
                            </p>
                            <div className={styles.ctaButtons}>
                                <Link to="/register">
                                    <Button className={styles.ctaButton}>
                                        Get Started Today - It's Free
                                        <svg className={styles.buttonIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Button>
                                </Link>
                                <div className={styles.ctaSupport}>
                                    <span>Questions? <a href="/contact">We're here to help</a></span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
                <div className={styles.ctaBackground}>
                    <div className={styles.ctaPattern}></div>
                </div>
            </section>
        </div>
    );
};

export default Home;