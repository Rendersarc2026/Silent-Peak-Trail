export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <span className="footer-logo">Silent Peak <span>Trail</span></span>
          <p className="footer-tagline">
            Award-winning Ladakh travel specialists since 2009. We craft extraordinary
            journeys into the Himalayas — guided by people who call these mountains home.
          </p>
          <div className="footer-socials">
            <a href="#" className="fsocial">in</a>
            <a href="#" className="fsocial">ig</a>
            <a href="#" className="fsocial">fb</a>
            <a href="#" className="fsocial">yt</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Tour Packages</h4>
          <ul>
            <li><a href="#">Pangong Lake Explorer</a></li>
            <li><a href="#">Golden Triangle</a></li>
            <li><a href="#">Chadar Trek</a></li>
            <li><a href="#">Markha Valley Trek</a></li>
            <li><a href="#">Moto Expedition</a></li>
            <li><a href="#">Monastery Circuit</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Destinations</h4>
          <ul>
            <li><a href="#">Leh City</a></li>
            <li><a href="#">Pangong Tso</a></li>
            <li><a href="#">Nubra Valley</a></li>
            <li><a href="#">Tso Moriri</a></li>
            <li><a href="#">Zanskar Valley</a></li>
            <li><a href="#">Markha Valley</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Helpful Info</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Travel Tips</a></li>
            <li><a href="#">Permits &amp; Visa</a></li>
            <li><a href="#">Best Season Guide</a></li>
            <li><a href="#">Photo Gallery</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 <a href="#">Silent Peak Trail</a> — All rights reserved. Leh, Ladakh, India.</p>
        <p>Made with ♥ for the Himalayas</p>
      </div>
    </footer>
  );
}
