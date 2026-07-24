import Link from "next/link";
import type { ReactNode } from "react";

// Long-form content per service (build spec 4.2). Each block carries a
// factual hook specific to the service so pages are not interchangeable.

export type ServiceContent = {
  lead: string;
  body: ReactNode;
  reviewId: string;
  faqs: { q: string; a: string }[];
  siblings: [string, string];
};

export const serviceContent: Record<string, ServiceContent> = {
  mowing: {
    lead: "A lawn that gets cut right, on a schedule that matches how the grass actually grows.",
    reviewId: "josiah-barbeau",
    siblings: ["edging-and-trimming", "weed-removal"],
    faqs: [
      {
        q: "How often should a Bay Area lawn be mowed?",
        a: "Weekly from roughly March through October, when tall fescue is actively growing, and every other week through the cooler months. The rule that matters is never removing more than a third of the blade in one cut, so frequency follows growth, not the calendar.",
      },
      {
        q: "What height do you cut at?",
        a: "Three to three and a half inches for tall fescue, which is what most East Bay lawns are. Taller blades shade the soil, which keeps roots cooler and cuts evaporation, so the lawn needs less water to stay green.",
      },
      {
        q: "Do you take the clippings?",
        a: "Usually we mulch them back in, where they break down fast and return nitrogen to the soil. If the lawn got long between visits and the clippings would clump, we collect them and haul them out.",
      },
    ],
    body: (
      <>
        <h2>What a visit includes</h2>
        <p>
          Every mowing visit is the full pass: the cut at the right height, string trimming along
          fences and beds, edging along walks and drives, and a blower pass so the hard surfaces
          are clean when we pull away. The mow is the fast part. The finish work is what makes it
          look maintained instead of just shorter.
        </p>
        <h2>Why the height matters</h2>
        <p>
          Most East Bay lawns are tall fescue, and tall fescue wants to be cut at three to three
          and a half inches. Cutting shorter to stretch the time between visits is the most common
          mistake in lawn care, and it backfires: short grass exposes the soil, dries faster,
          stresses the roots, and opens gaps that weeds move into within weeks. We follow the
          one-third rule on every cut. If a lawn has gotten long, we bring it down over two visits
          rather than scalping it in one.
        </p>
        <p>
          The Contra Costa Water District's own lawn guidance says the same thing: mow high so the
          blades shade the soil, mow weekly so no more than the top third comes off, and keep the
          mower blades sharp, because dull blades shred the grass tips and make a healthy lawn look
          brown. We sharpen ours on a schedule.
        </p>
        <h2>Clean equipment is not a detail</h2>
        <p>
          One more thing from the water district worth knowing: bermuda grass spreads from house to
          house on gardeners' uncleaned mower decks. It is one of the hardest weeds to get back out
          of a fescue lawn once it is in. We clean our deck between properties. If your last crew
          did not, that may be where those wiry patches came from.
        </p>
        <h2>Recurring or one-time</h2>
        <p>
          Weekly and every-other-week clients get a fixed weekday and a lower per-visit rate.
          One-time cuts are welcome too, and if the lawn is badly overgrown we will quote it as a{" "}
          <Link href="/services/yard-cleanup">cleanup</Link> first so the price is honest about the
          work involved.
        </p>
      </>
    ),
  },

  "edging-and-trimming": {
    lead: "The clean line where the grass meets the concrete. It is the whole reason we are called Green Line.",
    reviewId: "chris-b",
    siblings: ["mowing", "weed-removal"],
    faqs: [
      {
        q: "What is the difference between edging and trimming?",
        a: "Edging cuts a vertical line where turf meets a hard surface like a walk or driveway, using a blade. Trimming uses a string trimmer to bring grass down where the mower cannot reach: along fences, around trees, against beds and sprinkler heads.",
      },
      {
        q: "How often does edging need to be done?",
        a: "Every mowing visit. The edge grows over in one to two weeks in the growing season, and an overgrown edge is the first visible sign a property has slipped. It is included in every one of our mowing visits, never an add-on.",
      },
      {
        q: "Will you trim around my sprinkler heads?",
        a: "Yes, carefully, and it matters more than it sounds. Grass that grows over a head blocks the spray pattern, so parts of the lawn quietly stop getting water and brown out while the bill stays the same.",
      },
    ],
    body: (
      <>
        <h2>Why It Matters</h2>
        <p>
          Stand at the curb of any two houses, one with a lawn that was mowed and one with a
          property that is being maintained. From thirty feet they look the same. The difference is
          at the boundary: where the grass meets the walk, the drive, the beds. A crisp vertical
          edge says someone is paying attention. A soft, creeping edge says nobody has in a while.
          It is the first thing that goes when a crew is rushing, because it is the slowest part of
          the visit and the easiest to skip.
        </p>
        <h2>What gets edged and trimmed</h2>
        <p>
          Walks, driveways, curb lines, and patio borders get a bladed edge. Fence lines, tree
          rings, bed borders, mailbox posts, and utility fixtures get string-trimmed to the same
          height as the cut. Sprinkler heads get cleared so the spray is never blocked, which the
          Contra Costa Water District specifically recommends for keeping coverage even and the
          water bill honest.
        </p>
        <h2>Beds hold their shape</h2>
        <p>
          A defined bed edge is also the cheapest weed control there is. When the line between
          turf and bed is maintained, grass cannot creep in and{" "}
          <Link href="/services/weed-removal">weeds</Link> have nowhere to hide. When it is not,
          you end up paying to fix the border every season instead of maintaining it every visit.
        </p>
      </>
    ),
  },

  "yard-cleanup": {
    lead: "Overgrown, storm-hit, or a few years behind. We bring it back and haul the evidence away.",
    reviewId: "operations-llc",
    siblings: ["weed-removal", "hedge-and-shrub"],
    faqs: [
      {
        q: "How do you price a cleanup?",
        a: "By the scope, quoted from your photos in most cases. What drives the price is volume: how much growth has to come out and how much debris has to leave. Send photos through the estimate form and you will get a number the same day.",
      },
      {
        q: "Do you haul the debris away?",
        a: "Yes. Green waste is loaded out and disposed of properly, and the property is blown clean before we leave. A cleanup that leaves piles at the curb is half a cleanup.",
      },
      {
        q: "My property got a code or HOA notice. Can you handle it?",
        a: "Yes, and quickly. Overgrowth notices come with deadlines, and we prioritize those jobs. Tell us the deadline in the estimate form notes and we will schedule around it.",
      },
    ],
    body: (
      <>
        <h2>What a cleanup covers</h2>
        <p>
          Cutting down overgrowth, clearing weeds from beds and fence lines, cutting back shrubs
          that have gone shapeless, raking out accumulated leaf and debris layers, re-establishing
          the edges, and hauling everything off. The goal is a property that looks reset, not
          trimmed around the problem.
        </p>
        <h2>Side yards and forgotten corners</h2>
        <p>
          The jobs we see most are not front lawns. They are side yards, the strip between the
          house and the fence that nobody walks through, where weeds go chest-high in one wet
          Bay Area winter. One season of neglect there looks like five. Those spaces come back in
          a single visit, and they stay back if you put them on a{" "}
          <Link href="/services/mowing">maintenance schedule</Link> afterward.
        </p>
        <h2>Selling or renting</h2>
        <p>
          Curb appeal is the cheapest work you can do on a listing, and landlords between tenants
          need the yard turned around on a date, not a window. We work to deadlines and we send
          finish photos when the job is done.
        </p>
      </>
    ),
  },

  "weed-removal": {
    lead: "Beds, cracks, fence lines, and the curb strip everyone forgets.",
    reviewId: "geraldine-brown",
    siblings: ["yard-cleanup", "edging-and-trimming"],
    faqs: [
      {
        q: "Do you pull weeds or spray them?",
        a: "Mostly mechanical: pulled, cut, and cleared, with roots out where the species allows it. Where a treatment makes sense we will tell you what we would use and why before anything is applied, and you decide.",
      },
      {
        q: "Why do the weeds keep coming back?",
        a: "Usually because the conditions that let them in are still there: bare soil, an unmaintained bed edge, or turf cut too short. Removal without maintenance is a rental, not a purchase. We will tell you which one you are buying.",
      },
      {
        q: "When should weeds be dealt with in the Bay Area?",
        a: "The cheap window is late winter. Pre-emergent timing is roughly February here, before the spring flush germinates. After that it is hand work, and the longer it waits the more of it there is.",
      },
    ],
    body: (
      <>
        <h2>Where weeds actually live</h2>
        <p>
          Not the middle of the lawn. They live at the boundaries: bed edges, fence lines, sidewalk
          cracks, driveway seams, and the curb strip between the walk and the street that belongs
          to you but feels like it belongs to nobody. That strip is also the single most visible
          piece of your frontage from the street, which is why a weedy one drags down a property
          that is otherwise fine.
        </p>
        <h2>Removal, honestly</h2>
        <p>
          We clear beds and lines mechanically and get roots where the species allows. What we will
          not do is promise a one-time visit makes weeds permanent history, because it does not.
          Weeds are a symptom of open ground. The durable fix is dense turf cut at the right
          height, maintained <Link href="/services/edging-and-trimming">edges</Link>, and covered
          bed soil. We do the removal, and we will tell you plainly what maintenance keeps it from
          being an annual purchase.
        </p>
      </>
    ),
  },

  "hedge-and-shrub": {
    lead: "Shaped so they read as intentional instead of neglected.",
    reviewId: "geraldine-brown",
    siblings: ["yard-cleanup", "mowing"],
    faqs: [
      {
        q: "How often should hedges be trimmed?",
        a: "Fast growers like privet want two to four trims a season. Slower shrubs may need one or two. The honest answer depends on the plant, and we will tell you the cadence for what you actually have rather than selling a schedule.",
      },
      {
        q: "Can a badly overgrown hedge be saved?",
        a: "Often, but not always in one pass. Shearing years of growth off at once can expose the bare interior, because most hedge species only hold leaves on the outer shell. The right fix is staged reduction, and we will tell you up front if that is what yours needs.",
      },
      {
        q: "Do you clean up the trimmings?",
        a: "Completely. Trimmings are raked, loaded, and hauled, and the beds and walks are blown clean. The hedge should be the only evidence we were there.",
      },
    ],
    body: (
      <>
        <h2>Shape is a maintenance product</h2>
        <p>
          A hedge holds its shape the way a lawn holds its edge: through regular, moderate work.
          Most common hedge species carry their foliage in a thin outer shell over bare wood, so
          the shape you see is only a few inches deep. Trimmed regularly, that shell stays dense
          and the line stays crisp. Left for a year and then sheared hard, the cut goes past the
          shell into bare interior, and the hedge looks worse than before it was touched.
        </p>
        <h2>Timing by plant, not by truck schedule</h2>
        <p>
          We trim to the plant. Spring-flowering shrubs get shaped after they bloom so next year's
          flowers are not cut off. Fast hedges get more passes, slow ones fewer. If a shrub is the
          wrong plant for the spot and no amount of trimming will make it right, we will say so
          instead of billing you to fight it forever.
        </p>
      </>
    ),
  },

  "gutter-cleaning": {
    lead: "Cleared and flushed before the rains, with the ground left clean before we go.",
    reviewId: "salvador-moreno",
    siblings: ["yard-cleanup", "commercial-maintenance"],
    faqs: [
      {
        q: "When should gutters be cleaned in the Bay Area?",
        a: "Late fall, after the trees have dropped and before the winter rains arrive in earnest. Properties under heavy trees often need a second pass. A clogged gutter in a Bay Area January overflows straight down the siding and into the foundation line.",
      },
      {
        q: "Do you flush the downspouts?",
        a: "Yes. Scooping the gutter and leaving a packed downspout is the most common shortcut in this work, and it means the system still fails in the first storm. Every downspout gets flushed and confirmed flowing.",
      },
      {
        q: "What happens to the debris?",
        a: "It comes down in buckets, not over the side, and it leaves with us. The beds and walks under the gutter line are cleaned before we go. One of our reviews is from a customer who noticed exactly that.",
      },
    ],
    body: (
      <>
        <h2>Why this is a lawn care company's job</h2>
        <p>
          Because the failure shows up in the landscape. An overflowing gutter carves out bed
          mulch, drowns the plants under the drip line, and dumps a winter's worth of roof grit
          into the lawn edge. Keeping the gutters clear is part of keeping the ground under them
          maintained, and we are already there.
        </p>
        <h2>What the visit includes</h2>
        <p>
          Every run scooped clean by hand, every downspout flushed with water and confirmed
          flowing, debris bucketed down rather than flicked over the side, and the ground beneath
          cleaned up completely. As one of our customers put it after a gutter visit: everything
          cleaned out thoroughly, and the area left clean before we left. That is the standard.
        </p>
      </>
    ),
  },

  "commercial-maintenance": {
    lead: "Storefronts, sign islands, and parking strips on a schedule you can count on.",
    reviewId: "operations-llc",
    siblings: ["mowing", "yard-cleanup"],
    faqs: [
      {
        q: "Can you service the property before we open?",
        a: "Yes. Early service windows are available Monday through Friday so the work is done before customers arrive and the crew is never in the way of your business.",
      },
      {
        q: "Do you handle small commercial properties?",
        a: "They are our specialty. A sign island, a parking strip, a storefront frontage: small scopes that big commercial landscapers will not price honestly and that make an outsized difference to how a business reads from the street.",
      },
      {
        q: "Can we get documentation for the property owner or manager?",
        a: "Yes. Scheduled service with completion photos on request, so a manager or owner who is not on site can see the property is being kept.",
      },
    ],
    body: (
      <>
        <h2>The sign island problem</h2>
        <p>
          Every commercial corridor has them: the little planted island under the road sign, the
          strip between the parking lot and the sidewalk, the frontage nobody owns day to day.
          When they go to weeds, the business behind them looks closed even when it is open. One of
          the jobs in <Link href="/work">our gallery</Link> is exactly this: a sign island on a
          busy corner, overgrown and littered, brought back to clean cut grass in one visit.
        </p>
        <h2>Scheduled, not summoned</h2>
        <p>
          Commercial upkeep works when it is on a calendar. We set a cadence, show up on the day,
          and the property never gets the chance to slip. For property managers, that is one line
          item and zero phone calls. For owner-operators, it is a frontage that always says open.
        </p>
      </>
    ),
  },

  "mulch-and-plantings": {
    lead: "Fresh mulch, stone, and new plants for beds that have gone bare or thin.",
    reviewId: "geraldine-brown",
    siblings: ["weed-removal", "hedge-and-shrub"],
    faqs: [
      {
        q: "How often should mulch be replaced?",
        a: "Once a year for most beds, usually in spring. It breaks down and feeds the soil, which is the point, so it needs topping up rather than replacing outright.",
      },
      {
        q: "Does mulch really cut down on weeds?",
        a: "A lot, yes. Two to three inches over clean soil blocks most weed seeds from getting the light they need. It is cheaper and safer than spraying, which is why we suggest it first.",
      },
      {
        q: "Can you match what is already in my beds?",
        a: "Usually. Send a photo with your estimate request and we will tell you what it is and whether we can match it or whether the bed is better off starting over.",
      },
    ],
    body: (
      <>
        <h2>What We Do</h2>
        <p>
          We clear out what is dead, define the bed border, lay fresh mulch or stone, and put in
          replacement plants where there are gaps. Stepping stones and small edging go in at the
          same time if you want them.
        </p>
        <h2>Why It Is Worth Doing</h2>
        <p>
          A bed with a clean border and a couple of inches of mulch is the cheapest weed control
          you can buy. It blocks the light weed seeds need, holds water in through the dry months,
          and keeps grass from creeping in from the lawn side. We would rather set a bed up
          properly than come back and pull the same weeds four times a year, and it works out
          cheaper for you too.
        </p>
        <p>
          If you are already on <Link href="/services/mowing">regular mowing</Link> we usually
          fold this into a visit rather than making a separate trip out.
        </p>
      </>
    ),
  },
};
