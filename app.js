document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Henter alle input-verdier
  const inputs = document.querySelectorAll("input");
  const values = Array.from(inputs).map((i) => parseFloat(i.value) || 0);

  // --- Eie bolig ---
  const [
    boligPris,
    egenkapital,
    rente,
    rentefradrag,
    nedbetalingstid,
    verdistigning,
    felleskostnader,
    kommunaleAvg,
    forsikring,
    eiendomsskatt,
    vedlikehold,
    kostnadKjop,
    kostnadSalg,
    // --- Leie bolig ---
    leie,
    leieOkning,
    depositum,
    sparekonto,
    spareRente,
    investering,
    avkastning,
    skatt,
    inflasjon,
  ] = values;

  // Lån og månedlig rente
  const lan = boligPris - egenkapital;
  const r = rente / 100 / 12;
  const n = nedbetalingstid * 12;

  // Månedlig terminbeløp (annuitetslån)
  const terminbelop = lan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  // Total renteutgift over hele perioden
  const totalBetalt = terminbelop * n;
  const totalRenter = totalBetalt - lan;

  // Rentefradrag
  const rentefradragKr = totalRenter * (rentefradrag / 100);
  const renterEtterFradrag = totalRenter - rentefradragKr;

  // Kostnader ved kjøp og salg (prosent av kjøpesum)
  const kostnaderVedKjop = boligPris * (kostnadKjop / 100);
  const kostnaderVedSalg = boligPris * (kostnadSalg / 100);

  // Vedlikehold per år (prosent av boligpris)
  const vedlikeholdKr = boligPris * (vedlikehold / 100);

  // Eiendomsskatt per år
  const eiendomsskattKr = boligPris * (eiendomsskatt / 100);

  // Verdistigning over årene
  const framtidigVerdi = boligPris * Math.pow(1 + verdistigning / 100, nedbetalingstid);

  // Totale årlige kostnader ved å eie
  const totaleEieKostnader =
    renterEtterFradrag +
    kostnaderVedKjop +
    kostnaderVedSalg +
    nedbetalingstid * (felleskostnader * 12 + kommunaleAvg * 12 + forsikring * 12 + vedlikeholdKr + eiendomsskattKr);

  // Netto gevinst/tap ved salg
  const nettoEie = framtidigVerdi - totaleEieKostnader;

  // --- Leie bolig ---
  let totalLeie = 0;
  let aarligLeie = leie;
  for (let i = 0; i < nedbetalingstid; i++) {
    totalLeie += aarligLeie;
    aarligLeie *= 1 + leieOkning / 100;
  }

  // Avkastning på sparing (årlig renters rente)
  const spareVerdi = sparekonto * Math.pow(1 + spareRente / 100, nedbetalingstid);
  const investeringEtterSkatt = investering * Math.pow(1 + (avkastning / 100) * (1 - skatt / 100), nedbetalingstid);

  // Netto leie-alternativ
  const nettoLeie = spareVerdi + investeringEtterSkatt - totalLeie;

  // --- Sammenligning ---
  const resultat = nettoEie - nettoLeie;

  alert(
    `📊 Resultat etter ${nedbetalingstid} år:\n\n` +
    `Eie-bolig verdi etter kostnader: ${nettoEie.toLocaleString("no-NO", { maximumFractionDigits: 0 })} kr\n` +
    `Leie-bolig verdi etter kostnader: ${nettoLeie.toLocaleString("no-NO", { maximumFractionDigits: 0 })} kr\n\n` +
    (resultat > 0
      ? `✅ Det lønner seg å EIE med ca. ${resultat.toLocaleString("no-NO", { maximumFractionDigits: 0 })} kr.`
      : `❌ Det lønner seg å LEIE med ca. ${Math.abs(resultat).toLocaleString("no-NO", { maximumFractionDigits: 0 })} kr.`)
  );
});
