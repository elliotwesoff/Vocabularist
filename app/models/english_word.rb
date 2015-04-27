class EnglishWord < ActiveRecord::Base
	has_many :german_words, dependent: :destroy
	has_many :plurals, dependent: :destroy

	def create_translations(params)
		#  this is probably real disgusting but i'm super fuckin burnt out n tird rn so
		#  don't fucking judge me bitch.  fuck off.

		if !params[:non_noun].blank?
			@non_noun = german_words.create(word: params[:non_noun], article: '', gender: '')
		else

			if !params[:masc_sing].blank?

				params[:masc_sing_art].blank? ? ms_art = 'der' : ms_art = params[:mas_sing_art]
				@masc_sing = german_words.create(word: params[:masc_sing], article: ms_art, gender: 'ms')

				if !params[:masc_plur].blank?

					params[:masc_plur_art].blank? ? mp_art = 'die' : mp_art = params[:masc_plur_art]
					@masc_sing.plurals.create(word: params[:masc_plur], article: mp_art, gender: 'mp')

				end

			end
			if !params[:fem_sing].blank?

				params[:fem_sing_art].blank? ? fs_art = 'die' : ms_art = params[:fem_sing_art]
				@fem_sing = german_words.create(word: params[:fem_sing], article: fs_art, gender: 'fs')

				if !params[:fem_plur].blank?
					params[:fem_plur_art].blank? ? fp_art = 'die' : fp_art = params[:fem_plur_art]
					@fem_sing.plurals.create(word: params[:fem_plur], article: fp_art, gender: 'fp')
				end

			end
			if !params[:neuter_sing].blank?

				params[:neuter_sing_art].blank? ? neu_art = 'das' : neu_art = params[:neuter_sing_art]
				@neu_sing = german_words.create(word: params[:neuter_sing], article: neu_art, gender: 'ns')

				if !params[:neuter_plur].blank?
					params[:neuter_plur_art].blank? ? neu_plur = 'die' : neu_art = params[:neuter_plur_art]
					@neu_sing.plurals.create(word: params[:neuter_plur], article: neu_art, gender: 'np')
				end
			end
		end

		{ masc: @masc_sing, fem: @fem_sing, neu: @neu_sing }
	end

	def self.get_json_words(words)
		word_hash = []

		words.each do |word|

			deutsches_wortes = word.german_words
			plurals = []

			deutsches_wortes.each do |wort|
				wort.plurals.each do |plural|
					plurals << plural
				end
			end

			word_hash << { english: word, german: deutsches_wortes, plurals: plurals }.to_json
		end

		word_hash
	end

	private

	def self.nuke!
		# FUCK YO COUCH CUHHH
		EnglishWord.destroy_all
		puts "destroyed all words."
	end
end
