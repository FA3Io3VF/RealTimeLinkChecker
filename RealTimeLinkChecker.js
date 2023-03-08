  class RealTimeLinkChecker {
    constructor(fetchAttempts = 3, fetchTimeout = 5000) {
      this.fetchAttempts = fetchAttempts;
      this.fetchTimeout = fetchTimeout;
      this.timeout = fetchTimeout;
      this.observerConfig = {
        attributes: false,
        childList: true,
        subtree: true,
        passive: true
      };
      this.ObservedLinks = false;
    }
  
    start(timeout = 5000) {
      this.timeout = timeout;
      new MutationObserver(async () => {
        if (!this.ObservedLinks) {
          await this.checkLinks(this.timeout);
          this.ObservedLinks = true;
        }
      }).observe(document, this.observerConfig);
    }
  
    async checkLinks() {
      const links = Array.from(document.querySelectorAll('a'));
      for (const linkElement of links) {
        const link = linkElement.getAttribute('href');
        if (link === link === '' || window.location.href || link === '#' || window.location) {
          continue;
        }
          if (!this.isURL(link)) {
          continue;
        }
  
        for (let attempt = 1; attempt <= this.fetchAttempts; attempt++) {
          try {
            const response = await fetch(link, { timeout: this.fetchTimeout });
            if (!response.ok) {
              console.error(`Network response was not ok for link ${link}`);
            }
            break;
          } catch (error) {
            console.error(`Failed to fetch data for link ${link}`, error);
            await new Promise(resolve => setTimeout(resolve, this.fetchTimeout));
          }
        }
      }
    }
  
                      
    IsURLSyntax = (url) => {
      /* RegExp reference: https://www.debuggex.com/r/KaJrYj7vm9pKgOhK */
      const strRegex = "^((https|http|ftp|rtsp|mms)?://)"
          + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
          + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
          + "|"
          + "([0-9a-z_!~*'()-]+\.)*"
          + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
          + "[a-z]{2,6})"
          + "(:[0-9]{1,4})?"
          + "((/?)|"
          + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
      var re=new RegExp(strRegex);
      return re.test(url);
    }
  
      isValidURL(url, protocols = ['http', 'https', 'ftp']) {
        try {
          const { protocol } = new URL(url);
          if (this.IsURLSyntax(url)) {
            return protocols.includes(protocol);
          }
          else {
            return false
          }
        } catch (_) {
          return false;
        }
      }
  }
