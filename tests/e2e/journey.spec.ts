import { test, expect } from "@playwright/test";
test("complete all missions, adapt, reload, export and reset",async({page})=>{
  const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading",{level:1})).toContainText("Different minds.");
  await page.getByRole("button",{name:"Find your team rhythm"}).click();
  const choices=["Riverside courtyard","Community collage studio","Run a supported hybrid trial"];
  for(let i=0;i<3;i++){
    const commit=page.getByRole("button",{name:"Commit team decision"});
    await expect(commit).toBeDisabled();
    for(let n=0;n<3;n++)await page.getByRole("button",{name:"Share with agent",exact:true}).first().click();
    for(const summary of await page.locator(".evidence-list summary").all())await summary.click();
    await page.getByRole("button",{name:"Challenge the assumption",exact:true}).click();
    await page.getByRole("radio",{name:new RegExp(choices[i])}).check();
    await page.getByLabel("Connect the dots").fill("The shared human priorities and the checked evidence support this decision.");
    if(i===0){
      await page.reload();
      await page.getByRole("button",{name:"Continue your experiment"}).click();
      await expect(page.getByRole("radio",{name:/Riverside courtyard/})).toBeChecked();
      await expect(page.getByLabel("Connect the dots")).toHaveValue(/shared human priorities/);
    }
    await commit.click();
    await expect(page.getByRole("heading",{name:"How should we work next?"})).toBeVisible();
    await page.getByRole("radio",{name:/Show your reasoning/}).check();
    await page.getByLabel("One thing to carry forward").fill("Check the evidence before deciding.");
    await page.getByRole("button",{name:i===2?"Reveal your team report":new RegExp("Carry this into mission")}).click();
    if(i<2)await expect(page.getByText("Agent approach:",{exact:false})).toContainText("show your reasoning");
  }
  await expect(page.getByRole("heading",{level:1})).toContainText("Team Report.");
  await expect(page.locator(".report-summary .metric-label strong")).toHaveText(["100/100","100/100","100/100","100/100"]);
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:"Download report"}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe("human-ai-team-report.md");
  await page.reload();
  await page.getByRole("button",{name:"Continue your experiment"}).click();
  await expect(page.getByRole("heading",{level:1})).toContainText("Team Report.");
  await page.getByRole("button",{name:"Try a new approach"}).click();
  await page.getByRole("button",{name:"Keep my session"}).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button",{name:"Reset session",exact:true}).click();
  await page.getByRole("button",{name:"Reset and restart"}).click();
  await expect(page.getByRole("heading",{level:1})).toContainText("The perfect detour");
  await expect(page.getByRole("button",{name:"Share with agent",exact:true})).toHaveCount(3);
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test("mobile navigation and alternate low-evidence decision remain usable",async({page,isMobile})=>{
  await page.goto("/");
  if(isMobile){await page.getByRole("button",{name:"Toggle navigation"}).click();await page.getByRole("link",{name:"The missions",exact:true}).click();await expect(page.getByRole("heading",{name:/Three missions/})).toBeVisible();}
  await page.getByRole("button",{name:"Enter the lab",exact:true}).click();
  await page.getByRole("radio",{name:/Skyline lookout/}).check();
  await page.getByLabel("Connect the dots").fill("I chose the landmark without sharing Alex's personal needs.");
  await page.getByRole("button",{name:"Commit team decision"}).click();
  await expect(page.locator(".fit-score")).toContainText("25");
  await expect(page.locator(".metric-label strong").first()).toHaveText("0/100");
});

