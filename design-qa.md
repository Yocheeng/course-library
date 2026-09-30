# Design QA — OS question bank

Date: 2026-10-01

**Findings**

No actionable P0, P1, or P2 visual or usability issues remain.

**Open Questions**

None. This page follows the selected light-blue blueprint direction. The requested doll watermark is omitted; the small textbook line drawing is a separate, low-opacity academic accent.

**Source and implementation**

- Source visual truth: C:\Users\user\.codex\generated_images\01a0f187-977f-74d2-834c-3daec9874cf6\exec-b12662fe-c693-4074-8098-7ccda0bfc78d.png
- Source image pixels: 1774 × 887.
- Desktop implementation capture: design-qa/os-blueprint-desktop.jpg (1759 × 880 raw capture).
- Desktop CSS viewport: 1774 × 888; devicePixelRatio: 1. The in-app capture omits the right and bottom scrollbar strips; no scaling was applied. The shared page area was compared at the same CSS scale.
- Mobile implementation capture: design-qa/os-blueprint-mobile.jpg (375 × 811 raw capture).
- Mobile CSS viewport: 390 × 844; devicePixelRatio: 1. The capture surface omits browser viewport chrome; no scaling was applied. Mobile is an additional responsive check, not a source-image comparison.
- State: 作業系統基礎, page 1, search empty, all chapters, answers visible.
- Full-view comparison: source and implementation were opened in the same comparison input. Header, sidebar, hero, search controls, results strip, and first question are all visible.
- Focused-region comparison: a separate crop was unnecessary because the matched desktop view keeps the sidebar, form controls, question, diagram, and all four choices readable.

**Required fidelity surfaces**

- Typography: system sans-serif with Traditional Chinese fallbacks; heading, section labels, question, and choice hierarchy are preserved. Labels and choices remain readable without clipping.
- Spacing and layout: desktop sidebar and card heights now follow the selected proportions. Measured implementation regions are heading x=405, y=113, 1332 × 191; controls x=405, y=324, 1332 × 155; first question x=405, y=558. These are within a few pixels of the source composition.
- Colors and tokens: pale-blue blueprint grid, white translucent cards, blue borders, navy text, and blue active state match the selected palette. Grid opacity is reduced so it stays behind the question text.
- Images and icons: generated CPU/memory/process overview, user-to-OS flow, and faint textbook illustration load successfully. Unit icons use the project’s existing icon assets. No doll image or watermark is present.
- Copy and content: original Chinese/English questions, answers, explanations, and counts remain unchanged. The footer now derives unit and question totals from the data.

**Comparison history**

1. The first matched desktop pass found two P2 differences: the sidebar/cards were too compact, and the OS flow image sat below the question text, pushing answer choices down. The sidebar width and card heights were increased, and the flow image was aligned beside the stem and translation. The revised capture places the first question at y=558 and all four choices within the source’s first-card region.
2. Seven-unit mobile testing found a P2 horizontal overflow from a retained desktop gutter. The mobile breakpoint now resets that gutter. At a 390 × 844 viewport, document scroll width equals the 375-pixel client width; there is no horizontal overflow.

**Interactions and verification**

- Desktop seven-unit fixture: the navigation has 586 px visible height and 949 px content height. A wheel scroll moves it to the last unit while the page remains at scrollY=0.
- Mobile seven-unit fixture: the navigation has 310 px visible height and 661 px content height. A wheel scroll reveals the last unit while the page remains at scrollY=0 and there is no horizontal overflow.
- ArrowDown from the first unit focuses the next unit.
- Searching WHAT returns 5 of 41 questions and produces 5 highlighted matches.
- Answer visibility toggles both ways; chapter filtering works; switching to 作業系統架構 shows 121 questions and returning resets search/filter state.
- All referenced images load. Browser console warning/error log is empty.
- JavaScript syntax check and git diff whitespace check pass. Original question data is identical to main when parsed as JSON. algorithms.html has no diff from main.

**Implementation Checklist**

- Remove doll imagery.
- Add the independently scrollable unit list for future units.
- Match the selected OS blueprint style.
- Preserve search, highlighting, answer visibility, chapter filter, unit switching, and pagination.
- Keep the Algorithms page unchanged.

**Follow-up Polish**

No blocking polish remains. The blueprint diagrams intentionally omit the tiny labels from the concept image so they stay clean at phone size.

final result: passed
