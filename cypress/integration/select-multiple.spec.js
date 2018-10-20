describe('Choices - select multiple', () => {
  beforeEach(() => {
    cy.visit('/select-multiple.html');
  });

  describe('configs', () => {
    describe('basic', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=basic]')
          .find('.choices__input--cloned')
          .focus();
      });

      describe('selecting choices', () => {
        describe('focusing on text input', () => {
          const selectedChoiceText = 'Dropdown item 1';

          it('displays a dropdown of choices', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('be.visible');

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .should('have.length', 4)
              .each(($choice, index) => {
                expect($choice.text().trim()).to.equal(
                  `Dropdown item ${index + 1}`,
                );
              });
          });

          it('allows me select choices from a dropdown', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple .choices__item')
              .last()
              .should($item => {
                expect($item).to.contain(selectedChoiceText);
              });
          });

          describe('selecting all available choices', () => {
            beforeEach(() => {
              for (let index = 0; index <= 4; index++) {
                cy.get('[data-test-hook=basic]')
                  .find('.choices__input--cloned')
                  .focus();

                cy.get('[data-test-hook=basic]')
                  .find('.choices__list--dropdown .choices__list')
                  .children()
                  .first()
                  .click();
              }
            });

            it('displays "no choices to choose" prompt', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('be.visible')
                .should($dropdown => {
                  const dropdownText = $dropdown.text().trim();
                  expect(dropdownText).to.equal('No choices to choose from');
                });
            });
          });

          it('removes selected choice from dropdown list', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .each($choice => {
                expect($choice.text().trim()).to.not.equal(selectedChoiceText);
              });
          });

          describe('pressing escape', () => {
            beforeEach(() => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('{esc}');
            });

            it('closes the dropdown', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('not.be.visible');
            });

            describe('typing more into the input', () => {
              it('re-opens the dropdown', () => {
                cy.get('[data-test-hook=basic]')
                  .find('.choices__input--cloned')
                  .type('test');

                cy.get('[data-test-hook=basic]')
                  .find('.choices__list--dropdown')
                  .should('be.visible');
              });
            });
          });
        });
      });

      describe('removing choices', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .last()
            .click();
        });

        describe('on backspace', () => {
          it('removes last choice', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .type('{backspace}');

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple')
              .children()
              .should('have.length', 0);
          });
        });
      });

      describe('searching choices', () => {
        describe('on input', () => {
          describe('searching by label', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('item 2');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should($choice => {
                  expect($choice.text().trim()).to.equal('Dropdown item 2');
                });
            });
          });

          describe('searching by value', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('find me');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should($choice => {
                  expect($choice.text().trim()).to.equal('Dropdown item 3');
                });
            });
          });

          describe('no results found', () => {
            it('displays "no results found" prompt', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('faergge');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('be.visible')
                .should($dropdown => {
                  const dropdownText = $dropdown.text().trim();
                  expect(dropdownText).to.equal('No results found');
                });
            });
          });
        });
      });
    });

    describe('remove button', () => {
      /*
        {
          removeItemButton: true,
        };
      */
      beforeEach(() => {
        cy.get('[data-test-hook=remove-button]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=remove-button]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .click();
      });

      describe('on click', () => {
        it('removes respective choice', () => {
          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple')
            .children()
            .should('have.length', 0);
        });
      });
    });

    describe('disabled choice', () => {
      describe('selecting a disabled choice', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__input--cloned')
            .focus();

          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown .choices__item--disabled')
            .click();
        });

        it('does not select choice', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--multiple .choices__item')
            .should('have.length', 0);
        });

        it('keeps choice dropdown open', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown')
            .should('be.visible');
        });
      });
    });

    describe('selection limit', () => {
      /*
        {
          maxItemCount: 5,
        };
      */
      const selectionLimit = 5;

      beforeEach(() => {
        for (let index = 0; index < selectionLimit; index++) {
          cy.get('[data-test-hook=selection-limit]')
            .find('.choices__input--cloned')
            .focus();

          cy.get('[data-test-hook=selection-limit]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .click();
        }
      });

      it('displays "limit reached" prompt', () => {
        cy.get('[data-test-hook=selection-limit]')
          .find('.choices__list--dropdown')
          .should('be.visible')
          .should($dropdown => {
            const dropdownText = $dropdown.text().trim();
            expect(dropdownText).to.equal(
              `Only ${selectionLimit} values can be added`,
            );
          });
      });
    });

    describe('prepend/append', () => {
      /*
        {
          prependValue: 'before-',
          appendValue: '-after',
        };
      */
      let selectedChoiceText;

      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .then($choice => {
            selectedChoiceText = $choice.text().trim();
          })
          .click();
      });

      it('works', () => {
        expect(true).to.equal(true);
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should($choice => {
            expect($choice.data('value')).to.equal(
              `before-${selectedChoiceText}-after`,
            );
          });
      });

      it('displays just the inputted value to the user', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should($choice => {
            expect($choice.text()).to.not.contain(
              `before-${selectedChoiceText}-after`,
            );
            expect($choice.text()).to.contain(selectedChoiceText);
          });
      });
    });

    describe('render choice limit', () => {
      /*
        {
          renderChoiceLimit: 1,
        };
      */
      it('only displays given number of choices in the dropdown', () => {
        cy.get('[data-test-hook=render-choice-limit]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .should('have.length', 1);
      });
    });

    describe('search floor', () => {
      /*
        {
          searchFloor: 10,
        };
      */

      describe('on input', () => {
        describe('search floor not reached', () => {
          it('displays choices not filtered by inputted value', () => {
            const searchTerm = 'item 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($choice => {
                expect($choice.text().trim()).to.not.contain(searchTerm);
              });
          });
        });

        describe('search floor reached', () => {
          it('displays choices filtered by inputted value', () => {
            const searchTerm = 'Dropdown item 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should($choice => {
                expect($choice.text().trim()).to.contain(searchTerm);
              });
          });
        });
      });
    });

    describe('placeholder', () => {
      /*
        {
          placeholder: true,
          placeholderValue: 'I am a placeholder',
        }
      */
      describe('when no value has been inputted', () => {
        it('displays a placeholder', () => {
          cy.get('[data-test-hook=placeholder]')
            .find('.choices__input--cloned')
            .should('have.attr', 'placeholder', 'I am a placeholder');
        });
      });
    });

    describe('remote data', () => {
      beforeEach(() => {
        cy.reload(true);
      });

      describe('when loading data', () => {
        it('shows a loading message as a placeholder', () => {
          cy.get('[data-test-hook=remote-data]')
            .find('.choices__input--cloned')
            .should('have.attr', 'placeholder', 'Loading...');
        });

        describe('opening the dropdown', () => {
          it('displays "no choices to choose" prompt', () => {
            cy.get('[data-test-hook=remote-data]').click();
            cy.get('[data-test-hook=remote-data]')
              .find('.choices__list--dropdown')
              .should('be.visible')
              .should($dropdown => {
                const dropdownText = $dropdown.text().trim();
                expect(dropdownText).to.equal('No choices to choose from');
              });
          });
        });
      });

      describe('when data has loaded', () => {
        describe('opening the dropdown', () => {
          it('displays the loaded data', () => {
            cy.wait(2000);
            cy.get('[data-test-hook=remote-data]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .should('have.length', 50)
              .each(($choice, index) => {
                expect($choice.text().trim()).to.equal(`Label ${index + 1}`);
                expect($choice.data('value')).to.equal(`Value ${index + 1}`);
              });
          });
        });
      });
    });
  });
});