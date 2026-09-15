/* One delegated listener. Every call to action carries data-event from its CTA
   node, so the event names live in the graph, not here. Loaded only when a GA4
   measurement id is set in site.json. */
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("a[data-event]");
  if (!a || typeof gtag !== "function") return;
  var page = location.pathname;
  var trip = (a.closest("[id]") || {}).id || "";
  gtag("event", a.getAttribute("data-event"), {
    page_path: page,
    link_url: a.getAttribute("href"),
    position: a.closest(".booking") ? "booking_block" : (a.closest(".site-header") ? "header" : (a.closest("footer") ? "footer" : "body")),
    trip: trip
  });
});

/* Form submissions. The click listener above cannot see them: a submit navigates
   away to the form service mid-event, so an event fired on submit is often lost.
   Instead the service sends the visitor back to a URL ending in #sent, and the
   panel revealed there carries its own data-event. Firing on arrival means the
   page has fully loaded, so the event always lands. The name still comes from the
   graph, not from here. */
(function () {
  if (!location.hash || location.hash.length < 2) return;
  var el;
  try {
    el = document.getElementById(location.hash.slice(1));
  } catch (err) {
    return;
  }
  if (!el || !el.hasAttribute("data-event") || typeof gtag !== "function") return;
  gtag("event", el.getAttribute("data-event"), {
    page_path: location.pathname,
    link_url: "",
    position: "body",
    trip: ""
  });
})();
