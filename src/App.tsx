import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Flame,
  Instagram,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
  X,
  Zap,
} from 'lucide-react';
import {
  type CartItem,
  type Category,
  type OrderMode,
  type Product,
  categories,
  formatPrice,
  images,
  orderModes,
  products,
} from './data';

type Page = 'home' | 'checkout' | 'confirmation';
type PaymentMethod = 'Kreditkarte' | 'Klarna' | 'PayPal' | 'Bar';
type CheckoutStep = 'cart' | 'details' | 'payment' | 'done';

const orderModeIcons: Record<string, typeof PackageCheck> = {
  PackageCheck,
  Truck,
  Utensils,
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-logo ${compact ? 'compact' : ''}`} aria-label="TadaaBiss">
      <div className="logo-crown">♛</div>
      <div className="logo-word"><span>TADAA</span><b>BISS</b></div>
      {!compact && <div className="logo-rule"><span>✦</span> EAT • MEET • REPEAT <span>✦</span></div>}
    </div>
  );
}

function App() {
  const [intro, setIntro] = useState(true);
  const [page, setPage] = useState<Page>('home');
  const [activeCategory, setActiveCategory] = useState<Category>('Shawarma');
  const [orderMode, setOrderMode] = useState<OrderMode>('Lieferung');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [language, setLanguage] = useState('DE');
  const [isScrolled, setIsScrolled] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [flyingItem, setFlyingItem] = useState<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 1600);
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (page === 'checkout' || page === 'confirmation') {
      window.scrollTo(0, 0);
    }
  }, [page]);

  const filteredProducts = useMemo(() => products.filter((product) => product.category === activeCategory), [activeCategory]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderMode === 'Lieferung' && cart.length > 0 ? 2.5 : 0;
  const total = subtotal + deliveryFee;

  const addToCart = (product: Product, event?: React.MouseEvent) => {
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setFlyingItem({ id: product.id, x: rect.left + rect.width / 2, y: rect.top });
      window.setTimeout(() => setFlyingItem(null), 800);
    }
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (id: number, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const scrollToMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });

  const handleCheckout = () => {
    setCartOpen(false);
    setPage('checkout');
  };

  const handleOrderComplete = () => {
    setOrderNumber(`TD-${Math.floor(1000 + Math.random() * 9000)}`);
    setPage('confirmation');
    setCart([]);
  };

  const backToHome = () => {
    setPage('home');
    setOrderNumber('');
  };

  return (
    <div className="app-shell">
      {flyingItem && <div className="fly-to-cart" style={{ left: flyingItem.x, top: flyingItem.y }} />}
      {intro && (
        <div className="intro-screen" onClick={() => setIntro(false)}>
          <div className="intro-curtain intro-curtain-left" />
          <div className="intro-curtain intro-curtain-right" />
          <div className="intro-content">
            <Sparkles className="intro-sparkle sparkle-one" size={22} />
            <Sparkles className="intro-sparkle sparkle-two" size={16} />
            <Sparkles className="intro-sparkle sparkle-three" size={12} />
            <Logo />
            <div className="intro-tadaa">TADAA<span>!</span></div>
            <p>Alles in einem Biss</p>
            <button className="skip-intro">Überspringen <ArrowRight size={14} /></button>
          </div>
          <div className="intro-confetti">
            {Array.from({ length: 20 }).map((_, i) => <span key={i} className={`confetti-piece c${i}`} />)}
          </div>
        </div>
      )}

      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#top" className="header-logo" onClick={backToHome}><Logo compact /></a>
        <nav className={`main-nav ${mobileMenu ? 'open' : ''}`}>
          <a href="#menu" onClick={() => setMobileMenu(false)}>Speisekarte</a>
          <a href="#categories" onClick={() => setMobileMenu(false)}>Kategorien</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>Über uns</a>
          <a href="#contact" onClick={() => setMobileMenu(false)}>Kontakt</a>
        </nav>
        <div className="header-actions">
          <button className="language-switch" onClick={() => setLanguage(language === 'DE' ? 'EN' : 'DE')} aria-label="Sprache wechseln">{language} <ChevronDown size={14} /></button>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label="Warenkorb öffnen">
            <ShoppingBag size={20} /><span>{cartCount}</span>
          </button>
          <button className="menu-trigger" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menü öffnen"><Menu size={24} /></button>
        </div>
      </header>

      {page === 'home' && (
        <main id="top">
          <section className="hero-section">
            <div className="hero-noise" />
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <div className="hero-grid-lines" />
            <div className="floating-crumb crumb-one" /><div className="floating-crumb crumb-two" /><div className="floating-crumb crumb-three" /><div className="floating-crumb crumb-four" />
            <div className="hero-copy">
              <div className="eyebrow"><span /> Straubing's Lieblingsbiss <span /></div>
              <h1>
                <span className="title-outline" data-text="TADAA">TADAA</span>
                <span className="title-gold" data-text="BISS">BISS</span>
              </h1>
              <p className="hero-claim">ALLES IN EINEM BISS <span>♥</span></p>
              <p className="hero-description">Shawarma. Pizza. Crispy.<br />Frisch, heiß und mit dem gewissen Tadaa.</p>
              <div className="hero-actions">
                <button className="btn btn-gold magnetic-btn" onClick={scrollToMenu}>Jetzt bestellen <ArrowRight size={18} /></button>
                <button className="btn btn-ghost" onClick={scrollToMenu}>Zur Speisekarte</button>
              </div>
              <div className="hero-meta"><span><span className="live-dot" /> Jetzt geöffnet</span><span>•</span><span>Mo – So · 11:00 – 23:00</span></div>
            </div>
            <div className="hero-visual">
              <div className="visual-ring ring-one" /><div className="visual-ring ring-two" /><div className="visual-ring ring-three" />
              <div className="hero-orbit">
                <div className="hero-food hero-food-pizza"><img src={images.pizza} alt="Frisch gebackene Pizza" /><div className="hero-food-label">PIZZA</div></div>
                <div className="hero-food hero-food-shawarma"><img src={images.shawarma} alt="Saftiges Shawarma" /><div className="hero-food-label">SHAWARMA</div></div>
                <div className="hero-food hero-food-chicken"><img src={images.chicken} alt="Knuspriges Crispy Chicken" /><div className="hero-food-label">CRISPY</div></div>
              </div>
              <div className="hero-sticker"><span>ALLES<br />IN EINEM<br />BISS</span><b>♥</b></div>
              <div className="steam steam-one" /><div className="steam steam-two" /><div className="steam steam-three" /><div className="steam steam-four" />
              <div className="hero-sparkle hs-one" /><div className="hero-sparkle hs-two" /><div className="hero-sparkle hs-three" />
            </div>
            <div className="scroll-cue"><span /> Scroll to taste</div>
          </section>

          <div className="marquee-band"><div className="marquee-content">SHAWARMA <i>✦</i> PIZZA <i>✦</i> CRISPY <i>✦</i> EAT <i>✦</i> MEET <i>✦</i> REPEAT <i>✦</i> SHAWARMA <i>✦</i> PIZZA <i>✦</i> CRISPY <i>✦</i> EAT <i>✦</i> MEET <i>✦</i> REPEAT <i>✦</i></div></div>

          <section className="order-section section-pad" id="order">
            <div className="section-kicker">DEIN TADAA MOMENT</div>
            <div className="section-heading centered"><h2>Wie darf's sein?</h2><p>Du entscheidest, wir machen's lecker.</p></div>
            <div className="order-cards">
              {orderModes.map(({ name, icon, text: modeText }) => {
                const Icon = orderModeIcons[icon];
                return <button key={name} className={`order-card ${orderMode === name ? 'active' : ''}`} onClick={() => setOrderMode(name)}>
                  <div className="order-icon"><Icon size={28} /></div>
                  <div><h3>{name}</h3><p>{modeText}</p></div>
                  <span className="order-check">{orderMode === name ? '✓' : ''}</span>
                </button>;
              })}
            </div>
          </section>

          <section className="category-showcase" id="categories">
            <CategoryShowcase
              id="cat-shawarma"
              title="Shawarma"
              tagline="Vom Spieß. Frisch gewickelt."
              description="Saftiges Hähnchen vom Drehspieß, mariniert mit geheimen Gewürzen, eingewickelt in weiches Fladenbrot. Jeder Biss ein Erlebnis."
              image={images.shawarma}
              accent="red"
              items={products.filter((p) => p.category === 'Shawarma')}
              onAdd={addToCart}
              reversed={false}
            />
            <CategoryShowcase
              id="cat-pizza"
              title="Pizza"
              tagline="Endlos Käse. Knuspriger Boden."
              description="Steinofen-Pizza mit gezogenem Mozzarella, frischer Tomatensauce und knusprigem Rand. Bei uns schmeckt Pizza wieder nach Pizza."
              image={images.pizzaSlice}
              accent="gold"
              items={products.filter((p) => p.category === 'Pizza')}
              onAdd={addToCart}
              reversed={true}
            />
            <CategoryShowcase
              id="cat-crispy"
              title="Crispy Chicken"
              tagline="Knusprig. Saftig. Unwiderstehlich."
              description="Golden paniert, außen knusprig und innen saftig. Mit unseren hausgemachten Dips ein echter Crunch-Traum."
              image={images.chickenPlate}
              accent="brown"
              items={products.filter((p) => p.category === 'Crispy Chicken')}
              onAdd={addToCart}
              reversed={false}
            />
          </section>

          <section className="menu-section section-pad" id="menu">
            <div className="menu-intro">
              <div><div className="section-kicker">FRISCH AUS DER KÜCHE</div><h2>Dein nächster<br /><em>Lieblingsbiss.</em></h2></div>
              <p>Großer Hunger oder kleiner Snack?<br />Bei uns wird jeder Biss zum Erlebnis.</p>
            </div>
            <div className="category-tabs">
              {categories.map((category) => (
                <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>
              ))}
            </div>
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onAdd={addToCart} />
              ))}
            </div>
          </section>

          <section className="highlight-section section-pad">
            <div className="highlight-top">
              <div><div className="section-kicker">UNSERE CROWD FAVORITES</div><h2>Das musst du<br /><em>probiert haben.</em></h2></div>
              <button className="text-link" onClick={scrollToMenu}>Alle Gerichte ansehen <ArrowRight size={17} /></button>
            </div>
            <div className="highlight-grid">
              {products.filter((product) => [2, 7, 11].includes(product.id)).map((product, index) => (
                <div key={product.id} className="highlight-card" style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}>
                  <div className="highlight-image">
                    <img src={product.image} alt={product.name} />
                    <span className="highlight-badge">{product.badge || 'FAVORIT'}</span>
                    <span className="highlight-number">0{index + 1}</span>
                  </div>
                  <div className="highlight-info">
                    <div><h3>{product.name}</h3><p>{product.description}</p></div>
                    <strong>{formatPrice(product.price)}</strong>
                  </div>
                  <button className="highlight-add" onClick={(e) => addToCart(product, e)}><Plus size={18} /></button>
                </div>
              ))}
            </div>
          </section>

          <section className="steps-section section-pad">
            <div className="section-kicker centered">SO EASY. SO TADAA.</div>
            <div className="section-heading centered"><h2>In 3 Bissen bei dir.</h2><p>Von der Bestellung bis zum ersten Crunch.</p></div>
            <div className="steps-grid">
              {[
                { icon: Utensils, n: '01', title: 'Gericht auswählen', text: 'Stell dir deinen perfekten Biss zusammen.' },
                { icon: Zap, n: '02', title: 'Online bestellen', text: 'Schnell, einfach und ohne Warteschlange.' },
                { icon: PackageCheck, n: '03', title: 'Genießen', text: 'Abholen, liefern lassen oder bei uns bleiben.' },
              ].map(({ icon: Icon, n, title, text }, index) => (
                <div className="step" key={n}>
                  {index < 2 && <div className="step-line" />}
                  <span className="step-number">{n}</span>
                  <div className="step-icon"><Icon size={30} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="about-section section-pad" id="about">
            <div className="about-image">
              <img src={images.shawarma} alt="Shawarma frisch vom Grill" />
              <div className="about-image-label"><span>MIT LIEBE</span><strong>GEMACHT</strong></div>
              <div className="about-steam s1" /><div className="about-steam s2" /><div className="about-steam s3" />
            </div>
            <div className="about-copy">
              <div className="section-kicker">DAS SIND WIR</div>
              <h2>Mehr als nur<br /><em>Fast Food.</em></h2>
              <p>Bei TadaaBiss kommt alles in einen Biss: saftiger Shawarma, Pizza mit endlos Käse und knuspriges Chicken – frisch zubereitet, mit Liebe und dem gewissen Tadaa-Feeling.</p>
              <p className="about-quote">"Eat. Meet. Repeat."</p>
              <div className="about-signature">TadaaBiss <span>♥</span></div>
            </div>
          </section>

          <section className="reviews-section section-pad">
            <div className="section-kicker centered">DIE LIEBE IST ECHT</div>
            <div className="section-heading centered">
              <h2>Was unsere Gäste sagen.</h2>
              <div className="review-rating"><span>★★★★★</span> 4,9 · Google Reviews</div>
            </div>
            <div className="reviews-grid">
              {[
                { name: 'Sophie K.', city: 'Straubing', text: 'Das Shawarma ist einfach unfassbar gut. Frisch, saftig und die Sauce ist ein Traum!', color: 'orange' },
                { name: 'Emre D.', city: 'Straubing', text: 'Endlich eine Pizza, die auch nach Pizza schmeckt. TadaaBiss Special ist Pflicht!', color: 'yellow' },
                { name: 'Lisa M.', city: 'Bogen', text: 'Super schneller Service und das Crispy Chicken ist richtig schön crunchy. Immer wieder!', color: 'green' },
              ].map((review) => (
                <article className="review-card" key={review.name}>
                  <div className="review-stars">★★★★★</div>
                  <p>"{review.text}"</p>
                  <div className="review-author">
                    <div className={`avatar ${review.color}`}>{review.name.charAt(0)}</div>
                    <div><strong>{review.name}</strong><span>{review.city} · vor 2 Wochen</span></div>
                    <span className="google-mark">G</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}

      {page === 'checkout' && (
        <CheckoutPage
          cart={cart}
          orderMode={orderMode}
          setOrderMode={setOrderMode}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onChange={changeQuantity}
          onComplete={handleOrderComplete}
          onBack={backToHome}
        />
      )}

      {page === 'confirmation' && (
        <ConfirmationPage orderNumber={orderNumber} orderMode={orderMode} onBack={backToHome} />
      )}

      <footer className="site-footer" id="contact">
        <div className="footer-wave" />
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>Alles in einem Biss.</p>
            <a className="instagram-link" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={19} /> @tadaabiss</a>
          </div>
          <div className="footer-column">
            <h4>Besuch uns</h4>
            <p><MapPin size={16} /> Stadtplatz 12<br />94315 Straubing</p>
            <p>Mo – So<br />11:00 – 23:00 Uhr</p>
          </div>
          <div className="footer-column">
            <h4>Kontakt</h4>
            <a href="tel:+499421123456">+49 9421 123 456</a>
            <a href="mailto:hallo@tadaabiss.de">hallo@tadaabiss.de</a>
            <div className="footer-socials"><span><Instagram size={18} /></span><span>f</span><span>t</span></div>
          </div>
          <div className="footer-newsletter">
            <h4>Hungrig auf News?</h4>
            <p>10% auf deine erste Bestellung sichern.</p>
            <div className="newsletter-input">
              <input placeholder="Deine E-Mail" />
              <button aria-label="Newsletter abonnieren"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 TadaaBiss</span>
          <div><a href="#contact">Impressum</a><a href="#contact">Datenschutz</a><a href="#contact">AGB</a></div>
          <span>Made for good bites <span className="gold-heart">♥</span></span>
        </div>
      </footer>

      <button className="mobile-order-cta" onClick={() => { scrollToMenu(); setCartOpen(false); }}>Jetzt bestellen <ArrowRight size={17} /></button>
      {cartOpen && (
        <CartDrawer
          cart={cart}
          cartCount={cartCount}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          orderMode={orderMode}
          onClose={() => setCartOpen(false)}
          onChange={changeQuantity}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}

function CategoryShowcase({ id, title, tagline, description, image, accent, items, onAdd, reversed }: {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  accent: 'red' | 'gold' | 'brown';
  items: Product[];
  onAdd: (product: Product, event?: React.MouseEvent) => void;
  reversed: boolean;
}) {
  return (
    <section className={`cat-showcase accent-${accent} ${reversed ? 'reversed' : ''}`} id={id}>
      <div className="cat-showcase-visual">
        <div className="cat-visual-frame">
          <img src={image} alt={title} />
          <div className="cat-visual-glow" />
          <div className="cat-visual-steam cs1" /><div className="cat-visual-steam cs2" />
        </div>
        <div className="cat-visual-badge">{title}</div>
      </div>
      <div className="cat-showcase-content">
        <div className={`cat-tag accent-${accent}`}><Flame size={15} /> {tagline}</div>
        <h2>{title}</h2>
        <p className="cat-desc">{description}</p>
        <div className="cat-items-list">
          {items.slice(0, 4).map((item, i) => (
            <div className="cat-list-item" key={item.id} style={{ '--delay': `${i * 100}ms` } as React.CSSProperties}>
              <div className="cat-list-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </div>
              <div className="cat-list-action">
                <span className="cat-list-price">{formatPrice(item.price)}</span>
                <button className="cat-list-add" onClick={(e) => onAdd(item, e)} aria-label={`${item.name} hinzufügen`}><Plus size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index, onAdd }: { product: Product; index: number; onAdd: (product: Product, event?: React.MouseEvent) => void }) {
  return (
    <article className={`product-card tone-${product.tone}`} style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="image-shine" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <span className="product-price">{formatPrice(product.price)}</span>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <button className="add-button" onClick={(e) => onAdd(product, e)}>In den Warenkorb <Plus size={17} /></button>
      </div>
    </article>
  );
}

function CartDrawer({ cart, cartCount, subtotal, deliveryFee, total, orderMode, onClose, onChange, onCheckout }: {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderMode: OrderMode;
  onClose: () => void;
  onChange: (id: number, delta: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="section-kicker">DEIN TADAA MOMENT</span>
            <h2>Warenkorb <small>({cartCount})</small></h2>
          </div>
          <button onClick={onClose} className="close-drawer" aria-label="Warenkorb schließen"><X size={22} /></button>
        </div>
        <div className="drawer-mode">
          <span>Bestellung</span>
          <strong>{orderMode}</strong>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={38} />
              <h3>Noch nichts im Körbchen.</h3>
              <p>Dein nächster Lieblingsbiss wartet.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <span>{formatPrice(item.price)}</span>
                  <div className="quantity-control">
                    <button onClick={() => onChange(item.id, -1)}><Minus size={14} /></button>
                    <b>{item.quantity}</b>
                    <button onClick={() => onChange(item.id, 1)}><Plus size={14} /></button>
                  </div>
                </div>
                <strong className="cart-line-total">{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <>
            <div className="upsell">
              <Sparkles size={17} />
              <span>Dazu passt: <strong>Pommes oder ein Dip?</strong></span>
              <ChevronRight size={18} />
            </div>
            <div className="coupon">
              <input placeholder="Gutscheincode" />
              <button>Einlösen</button>
            </div>
            <div className="cart-summary">
              <div><span>Zwischensumme</span><strong>{formatPrice(subtotal)}</strong></div>
              <div><span>Liefergebühr</span><strong>{deliveryFee ? formatPrice(deliveryFee) : 'Kostenlos'}</strong></div>
              <div className="summary-total"><span>Gesamt</span><strong>{formatPrice(total)}</strong></div>
            </div>
            <button className="checkout-button" onClick={onCheckout}>Zur Kasse <ArrowRight size={19} /></button>
            <p className="secure-note">Sicher bezahlen · Verschlüsselte Verbindung</p>
          </>
        )}
      </aside>
    </div>
  );
}

function CheckoutPage({ cart, orderMode, setOrderMode, subtotal, deliveryFee, total, onChange, onComplete, onBack }: {
  cart: CartItem[];
  orderMode: OrderMode;
  setOrderMode: (mode: OrderMode) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  onChange: (id: number, delta: number) => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<CheckoutStep>('details');
  const [payment, setPayment] = useState<PaymentMethod>('Kreditkarte');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', street: '', zip: '', city: '', table: '',
  });

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'cart', label: 'Warenkorb' },
    { key: 'details', label: 'Daten' },
    { key: 'payment', label: 'Zahlung' },
    { key: 'done', label: 'Bestätigung' },
  ];

  const setField = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: event.target.value }));
  };

  const canProceed = step === 'details'
    ? form.firstName && form.lastName && form.email && form.phone
    : step === 'payment'
    ? !!payment
    : true;

  const nextStep = () => {
    if (step === 'details') setStep('payment');
    else if (step === 'payment') onComplete();
  };

  const paymentMethods: { name: PaymentMethod; icon: typeof CreditCard; desc: string }[] = [
    { name: 'Kreditkarte', icon: CreditCard, desc: 'Visa, Mastercard' },
    { name: 'Klarna', icon: Zap, desc: 'Später oder in Raten' },
    { name: 'PayPal', icon: ShoppingBag, desc: 'Schnell & sicher' },
    { name: 'Bar', icon: PackageCheck, desc: 'Bei Lieferung' },
  ];

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /> Zurück</button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-progress">
        {steps.map((s, i) => (
          <div key={s.key} className={`progress-step ${step === s.key || (step === 'payment' && s.key === 'details') || (step === 'payment' && s.key === 'cart') ? 'active' : ''} ${i < steps.findIndex((x) => x.key === step) ? 'done' : ''}`}>
            <span className="progress-dot">{i + 1}</span>
            <span className="progress-label">{s.label}</span>
            {i < steps.length - 1 && <span className="progress-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-body">
        <div className="checkout-main">
          <div className="checkout-section">
            <h3>Bestellart</h3>
            <div className="checkout-mode-row">
              {orderModes.map(({ name, icon, text }) => {
                const Icon = orderModeIcons[icon];
                return (
                  <button key={name} className={`mode-chip ${orderMode === name ? 'active' : ''}`} onClick={() => setOrderMode(name)}>
                    <Icon size={20} />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="checkout-section">
            <h3>Deine Artikel</h3>
            <div className="checkout-cart-list">
              {cart.map((item) => (
                <div className="checkout-cart-row" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="ccr-info">
                    <h4>{item.name}</h4>
                    <span>{formatPrice(item.price)}</span>
                    <div className="quantity-control small">
                      <button onClick={() => onChange(item.id, -1)}><Minus size={12} /></button>
                      <b>{item.quantity}</b>
                      <button onClick={() => onChange(item.id, 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-section">
            <h3>Deine Daten</h3>
            <div className="checkout-form-grid">
              <input className="form-input" placeholder="Vorname" value={form.firstName} onChange={setField('firstName')} />
              <input className="form-input" placeholder="Nachname" value={form.lastName} onChange={setField('lastName')} />
              <input className="form-input" placeholder="E-Mail" type="email" value={form.email} onChange={setField('email')} />
              <input className="form-input" placeholder="Telefon" value={form.phone} onChange={setField('phone')} />
              {orderMode === 'Lieferung' && (
                <>
                  <input className="form-input full" placeholder="Straße + Hausnummer" value={form.street} onChange={setField('street')} />
                  <input className="form-input" placeholder="PLZ" value={form.zip} onChange={setField('zip')} />
                  <input className="form-input" placeholder="Stadt" value={form.city} onChange={setField('city')} />
                </>
              )}
              {orderMode === 'Vor Ort' && (
                <input className="form-input full" placeholder="Tischnummer" value={form.table} onChange={setField('table')} />
              )}
            </div>
          </div>

          <div className="checkout-section">
            <h3>Zahlungsmethode</h3>
            <div className="payment-grid">
              {paymentMethods.map(({ name, icon: Icon, desc }) => (
                <button key={name} className={`payment-card ${payment === name ? 'active' : ''}`} onClick={() => setPayment(name)}>
                  <Icon size={22} />
                  <div><strong>{name}</strong><span>{desc}</span></div>
                  <span className="payment-check">{payment === name ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="checkout-pay-btn" onClick={nextStep} disabled={!canProceed}>
            {step === 'payment' ? `Jetzt bezahlen · ${formatPrice(total)}` : 'Weiter'}
            <ArrowRight size={19} />
          </button>
        </div>

        <aside className="checkout-summary-panel">
          <h3>Zusammenfassung</h3>
          <div className="summary-rows">
            <div className="summary-row"><span>Zwischensumme</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="summary-row"><span>Liefergebühr</span><strong>{deliveryFee ? formatPrice(deliveryFee) : 'Kostenlos'}</strong></div>
            <div className="summary-row total"><span>Gesamt</span><strong>{formatPrice(total)}</strong></div>
          </div>
          <div className="summary-mode">
            <Truck size={16} /> {orderMode}
          </div>
          <div className="summary-note">
            <Sparkles size={15} />
            <p>{orderMode === 'Lieferung' ? 'Geschätzte Lieferzeit: 25–35 Min.' : orderMode === 'Abholung' ? 'Abholbereit in 15–20 Min.' : 'Tisch wird vorbereitet.'}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ConfirmationPage({ orderNumber, orderMode, onBack }: {
  orderNumber: string;
  orderMode: OrderMode;
  onBack: () => void;
}) {
  const [barProgress, setBarProgress] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBarProgress((p) => Math.min(p + 2, 100));
    }, 60);
    return () => window.clearInterval(interval);
  }, []);

  const waitTime = orderMode === 'Lieferung' ? '25–35 Min.' : orderMode === 'Abholung' ? '15–20 Min.' : 'Sofort';

  return (
    <main className="confirmation-page">
      <div className="confetti-rain">
        {Array.from({ length: 30 }).map((_, i) => <span key={i} className={`confetti-rain-piece cr${i}`} />)}
      </div>
      <div className="confirmation-card">
        <div className="confirmation-check">
          <svg viewBox="0 0 80 80" className="check-svg">
            <circle cx="40" cy="40" r="36" className="check-circle" />
            <path d="M24 42 L35 53 L58 28" className="check-path" />
          </svg>
        </div>
        <div className="confirmation-tadaa">Tadaa!</div>
        <h2>Danke, Habibi!</h2>
        <p>Deine Bestellung ist eingegangen und wird frisch zubereitet.</p>
        <div className="confirmation-meta">
          <div><span>Bestellnummer</span><strong>{orderNumber}</strong></div>
          <div><span>Bestellart</span><strong>{orderMode}</strong></div>
          <div><span>Geschätzte Zeit</span><strong>{waitTime}</strong></div>
        </div>
        <div className="confirmation-bar">
          <div className="confirmation-bar-fill" style={{ width: `${barProgress}%` }} />
          <span>{barProgress >= 100 ? 'Fertig!' : 'Wird zubereitet...'}</span>
        </div>
        <button className="confirmation-back-btn" onClick={onBack}>Zurück zur Startseite <ArrowRight size={18} /></button>
      </div>
    </main>
  );
}

export default App;
