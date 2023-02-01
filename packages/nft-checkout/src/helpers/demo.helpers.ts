export const getDemoUrls = () => {
  const url = new URL(window.location.href)
  const demoUrls = {
    demo: 'https://rarify-protocol.gitlab.io/platform-engineering/demo-settlement/?path=/story/demo-purchasewithanytoken--demo&full=true',
    demoInstructions:
      'https://rarify-protocol.gitlab.io/platform-engineering/demo-settlement/?path=/story/demo-purchasewithanytoken--demo-instructions&full=true',
  }

  // if (url.hostname === "rarify-protocol.gitlab.io") {
  //   demoUrls.demo = `/platform-engineering/demo-settlement${demoUrls.demo}`;
  //   demoUrls.demoInstructions = `/platform-engineering/demo-settlement${demoUrls.demoInstructions}`;
  // } else if (url.hostname === "rarimo.gitlab.io") {
  //   demoUrls.demo = `/demo-settlement${demoUrls.demo}`;
  //   demoUrls.demoInstructions = `/demo-settlement${demoUrls.demoInstructions}`;
  // }

  return demoUrls
}
