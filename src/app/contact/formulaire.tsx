      <section className={siteClass.sectionClass}>
        <div className="grid">
          <form onSubmit={sendEmail} className="w-full rounded-xl p-2 md:p-4 shadow-soft">
            <div className="flex justify-end mb-1">
              <p className="text-xs text-muted-foreground italic" id="required-fields-note">
                {t.formulaire.champ}
              </p>
            </div>

            <div className="grid gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* Identité */}
              <div>
                <label className={intituleZoneSaisieStyle}>{t.formulaire.identite}</label>
                <input
                  name="prenomNom"
                  type="text"
                  required
                  title={t.formulaire.message_tooltip}
                  className={inputBase}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className={intituleZoneSaisieStyle}>{t.formulaire.telephone}</label>
                <input name="phone" type="tel" className={inputBase} />
              </div>

              {/* Courriel */}
              <div>
                <label className={intituleZoneSaisieStyle}>{t.formulaire.email}</label>
                <input
                  name="courriel"
                  type="email"
                  required
                  title={t.formulaire.message_tooltip}
                  className={inputBase}
                />
              </div>

              {/* Sélection du soin / projet */}
              <div className="col-span-full sm:col-span-1">
                <label className={intituleZoneSaisieStyle}>{t.formulaire.projet}</label>
                <div className="relative">
                  <select
                    name="project"
                    className={selectBase}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value={t.projets.defaut}>{t.projets.defaut}</option>
                    {t.projets.labels.map((projet, index) => (
                      <option key={index} value={projet.option}>
                        {projet.option}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute h-4 w-4 text-muted-foreground top-1/2 -translate-y-1/2"
                    style={{ right: "10px" }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="col-span-full">
                <label className={intituleZoneSaisieStyle}>{t.formulaire.message}</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  title={t.formulaire.message_tooltip}
                  aria-describedby="required-fields-note"
                  className={inputBase}
                  placeholder={t.formulaire.message_suggestion}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`mt-4 ${siteStyle.boutonStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSending ? "Envoi en cours..." : t.formulaire.bouton}
            </button>

            <p className="mt-3 text-xs text-muted-foreground">{t.formulaire.confidentialite}</p>
          </form>
        </div>
      </section>