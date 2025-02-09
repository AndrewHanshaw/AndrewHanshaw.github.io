document.addEventListener('DOMContentLoaded', function() {
  // Select all copy buttons
  const copyButtons = document.querySelectorAll('.copy-code-button');

  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Find the nearest code block relative to the button
      const codeBlock = button.closest('.code-header')
                            .nextElementSibling.querySelector('code');

      if (codeBlock) {
        // Copy the text content of the code block to the clipboard
        navigator.clipboard.writeText(codeBlock.textContent)
            .then(() => {
              // Optional: Provide feedback to the user
              button.innerHTML =
                  '<i class="fas fa-check"></i>';  // Change icon to checkmark
              setTimeout(() => {
                button.innerHTML =
                    '<i class="fas fa-copy"></i>';  // Revert back to copy icon
              }, 2000);                             // Revert after 2 seconds
            })
            .catch(err => {
              console.error('Failed to copy text: ', err);
            });
      }
    });
  });
});
