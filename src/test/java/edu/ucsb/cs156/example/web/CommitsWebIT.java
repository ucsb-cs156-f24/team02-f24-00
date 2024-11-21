package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.ZonedDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.Commit;
import edu.ucsb.cs156.example.repositories.CommitRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class CommitsWebIT extends WebTestCase {

    @Autowired
    CommitRepository commitRepository;

    @Test
    public void admin_user_can_create_edit_delete_commits() throws Exception {

        ZonedDateTime zdt1 = ZonedDateTime.parse("2022-01-03T00:00:00Z");

        String message1 = "Merge pull request #212 from ucsb-cs156-f24/pc-update-pom-xml\n"
                + "pc - update version in pom.xml";

        Commit commit1 = Commit.builder()
                .url("https://github.com/ucsb-cs156-f24/STARTER-team02/commit/e107dcbce881afa1ea70ebc93c8dfb91cebb8630")
                .message(message1)
                .authorLogin("pconrad")
                .commitTime(zdt1)
                .build();

        commitRepository.save(commit1);

        setupUser(true);

        page.getByText("Commits").click();

        assertThat(page.getByTestId("CommitTable-cell-row-0-col-message")).hasText(message1);

        page.getByTestId("CommitTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-message")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_commit() throws Exception {
        setupUser(false);

        page.getByText("Commits").click();

        assertThat(page.getByText("Create Commits")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_create_commit_button() throws Exception {
        setupUser(true);

        page.getByText("Commits").click();

        assertThat(page.getByText("Create Commit")).isVisible();
    }
}